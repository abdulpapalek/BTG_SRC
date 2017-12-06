
from api.utils import build_preview_response_dict
from tigerpaw.models import (
     ServiceOrders, Accounts, TimeLogReasons, Priorities, Reps, SOStatuses, Contacts, AccountSystems, Systems,
     SOTypes, SOTechsAssigned, Expenses, ExpenseTypes, Contract, LaborRateCategories, Project, ProjectPhaseAssignment,
     Documents, CustomerAsset
     Documents, CustomerAsset, SOLogs
)

 from tigerpaw.utils import get_user_rep
 from tigerpaw.utils import get_user_rep, serialize_work_performed
 from tigerpaw.soap import TigerpawSoap
 from time_management.models import TimeEntry, UserProfile, PPLogEntry, ServiceZoneAlertNotificationSetting
 from time_management.utils import get_rep_weekly_time_entries, get_rep_piechart_data
class ServiceOrderViewSet(EnhancedModelViewSet):
         
    @detail_route(methods=['get'])
    def fetch_so_log(self, request, pk=None):
        all_sologs = SOLogs.objects.filter(sonumber=pk)[:3]
        work_performed = [
            dict(serialize_work_performed(log), internal=False) for log in all_sologs
        ]
        timeline = work_performed
        timeline.sort(key=lambda x: x['timestamp'] if x['timestamp'] else datetime.min,
                      reverse=True)
        return Response(timeline)
		
class CustomerViewSet(EnhancedModelViewSet):

     @detail_route(methods=['get'])
     def active_contracts(self, request, pk=None):
        account = Accounts.objects.get(pk=pk)
        data = ManageITSerializer(account.active_contracts, many=True, context={
                                            'year': None,
                                            'month': None
                                            }).data
        return Response(data)
 
class ManageITViewSet(BaseTokenAuthViewSet):

     @list_route(methods=['get'])
     def active(self, request, *args, **kwargs):
        serializer = ManageITSerializer(self.queryset.filter(status="Active"), many=True)
        month = None
        year = None
        if 'month' and 'year' in request.GET:
            if request.GET['month'] and request.GET['year'] is not None and not '':
                try:
                    month = int(request.GET['month'])
                    year = int(request.GET['year'])
                    datetime(year, month, 1)
                    if year > datetime.now().year or month > 12:
                        raise ValueError
                except ValueError:
                    month = None
                    year = None
        else:
            pass
        serializer = ManageITSerializer(self.queryset.filter(status="Active"),
                                        many=True,
                                        context={
                                            'year': year,
                                            'month': month
                                        })
        data = serializer.data
        data.sort(key=lambda x: x.get('customers')[0].get('code') if x.get('customers') else None)
        return Response(data)