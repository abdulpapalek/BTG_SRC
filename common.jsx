 let ShowClosedSOsToggle = function (props) {
     return (
             <div style={{marginLeft: "40px"}}>
                 <span className="info-sonumber">
                    <Link to={url} title={props.so.briefdescription}>{shortdescription}</Link>

                    <Tooltip trigger="mouseenter" delay={500}
                             inertia={true} animation="perspective" position="bottom"
                             unmountHTMLWhenHide={true}
                             html={(
                                    <div>
                                        <HoverDetails store={store} so={props.so}
                                                      sologs={props.sologs}
                                                      fetchSOLog={props.fetchSOLog}
                                                      clearSOLog={props.clearSOLog}/>
                                    </div>
                             )}
                    >
                        <Link to={url}>{shortdescription}</Link>
                    </Tooltip>
                 </span>
                 <small>{props.so.sonumber}</small>
             </div>
         </td>
     )
 };