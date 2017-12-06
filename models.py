from time_management.models import ContractHours


class Contract(models.Model):
        
    @cached_property
    def contracted_hours(self):
		try:
			return ContractHours.objects.get(contractnumber=self.contractnumber).hours
		except ContractHours.DoesNotExist:
			return None

	def contracted_hours_datawarehouse(self, year=None, month=None):
        """
        NB - this number comes from the Data Warehouse and is, apparently, old / inaccurate
        information. So, we won't use this for now at least. Keeping this here in case it
        becomes
        :param year:
        :param month:
        :return:
        """
        year = year or datetime.date.today().year
        month = month or datetime.date.today().month
        sql = """
        SELECT TOP 1 SUM([EstimatedLabourHours]) AS EstContractLabourHours
        FROM [BTG_DataWarehouse].[dbo].[ContractsAdditionalDetail]
        WHERE [ContractYear]={%s} AND [ContractMonth]={%s} AND [ContractNumber]={%s}
        GROUP BY [AccountNumber];
        """
        cursor = connections['data_warehouse'].cursor()
        cursor.execute(sql, [year, month, self.pk])
        try:
			return cursor.fetchone()[0]
        except TypeError as e:
            return None

    def hours_spent_for_account(self, year=None, month=None):
		year = year or datetime.date.today().year
		month = month or datetime.date.today().month
		return str(round(self.time_billed().total_seconds() / (60.0*60.0), 2))
 
    def time_billed(self, month=None, year=None):
        year = year or datetime.date.today().year
        month = month or datetime.date.today().month
        if month is not None:
            start_date = datetime.date.today().replace(day=1, month=month, year=year)
        else:
            start_date = datetime.date.today().replace(day=1)
        range_start = datetime.datetime.combine(start_date, datetime.time.min).replace(tzinfo=pytz.utc)
        range_end = range_start + relativedelta(months=+1)
		return range_end
 
    def hours_billed_print_filtered(self, **kwargs):
        return str(round(self.time_billed(month=kwargs['month'], year=kwargs['year']).total_seconds() / (60.0*60.0), 2))

    def linked_to_account(self, accountnumber):
        return ContractCustomers.objects.filter(contractnumber=self.pk, accountnumber=accountnumber).exists()