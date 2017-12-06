import React from 'react';
import {Link} from 'react-router';
import {Col, Row} from 'react-bootstrap';
import {ContactPhoneButton} from './../../customer/components/contactbuttons';
import {
       IBox, Loader, Linebreaks, Table, TableHeader
} from './../../main/components/common';

const HoverDetails = React.createClass({
    getInitialState: function () {
      this.props.clearSOLog();
      return {}
    },
    componentDidMount: function() {
      this.props.fetchSOLog(this.props.so.sonumber);
    },
    render: function () {
        var timelineItems = [];
        var index = 0;
        var empty = true;
        this.props.sologs.results.forEach(function (item) {
            timelineItems.push(
                <tr key={"timelineItem" + index} className="elementToHover">
                    <td>{item.timestamp_text}</td>
                    <td>{item.user}</td>
                    <td style={{width: '70%'}}>
                        <span className="label pull-right" title={item.reason}>
                                <small>
                                    {item.hours}h {item.minutes}m
                                </small>
                        </span>
                        <small>
                            <Linebreaks text={item.description} maxLines={8}/>
                        </small>
                    </td>
                </tr>
            );
            ++index;
        });
        if (index){
            empty = false;
        }
        var columnHeaders = ["When", "Who", (
            <span>
                What&nbsp;
            </span>
        )];
        return (
                <Row>
                    <Col sm={12} md={6} lg={4}>
                        <dl className="dl-horizontal">
                            <dt>Customer</dt>
                            <dd>
                                <small>
                                    <Link to={"/customer/" + this.props.so.account.number}>
                                        {this.props.so.account.name} ({this.props.so.account.code})
                                    </Link>
                                    {this.props.so.accountphone && (
                                        <span>
                                            &nbsp;<ContactPhoneButton contact={{telephone: this.props.so.accountphone}} />
                                        </span>
                                    )}
                                </small>
                            </dd>
                            <dt>Brief Desc.</dt><dd><small>{this.props.so.briefdescription}</small></dd>
                            <dt>Zone</dt><dd><small>{this.props.so.servicezone}</small></dd>
                        </dl>
                    </Col>
                    <Col sm={12} md={6} lg={4}>
                        <dl className="dl-horizontal">
                            <dt>Type</dt><dd><small>{this.props.so.sotype}</small></dd>
                            <dt>Received</dt><dd>{this.props.so.datetime_received}</dd>
                            <dt>Priority</dt><dd><small>{this.props.so.priority}</small></dd>
                            <dt>Ref No.</dt><dd><small>{this.props.so.reference}</small></dd>
                            <dt>System</dt><dd><small>{this.props.so.system}</small></dd>
                            <dt>Customer PO</dt><dd><small>{this.props.so.customerpo}</small></dd>
                        </dl>
                    </Col>
                    <Col sm={12} md={6} lg={4}>
                        <dl className="dl-horizontal">
                            <dt>Primary Technician</dt>
                            <dd>
                                <small>{this.props.so.techassigned ? this.props.so.techassigned.fullname : ""}</small>
                            </dd>
                            <dt>Estimated Time</dt>
                            <dd><small>{this.props.so.estimatedhrs}h {this.props.so.estimatedmins}m</small></dd>
                        </dl>
                    </Col>
                    <div style={{padding:"15px"}}>
                        <Loader loaded={!this.props.sologs.loading}>
                            {empty ?
                                ' ' :
                                <Col lg={12}>
                                    <dl className="dl-horizontal">
                                        <IBox>
                                            <Table hover={true} striped={true} responsive={true} headers={columnHeaders}>
                                                {timelineItems}
                                            </Table>
                                        </IBox>
                                    </dl>
                                </Col>
                            }
                        </Loader>
                    </div>
                </Row>
        )
    }
});

module.exports = {HoverDetails: HoverDetails};