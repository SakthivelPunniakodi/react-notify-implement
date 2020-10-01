import React, { useState, useEffect, useRef } from 'react';
import PropTypes from "prop-types";

import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';

import moment from 'moment';

import { reactLocalStorage } from 'reactjs-localstorage';

import { Bell, BookOpen, AlertTriangle } from 'react-feather';

import 'bootstrap/dist/css/bootstrap.min.css';
import './notify.css';
import { navigate } from "@reach/router"
import { useHistory } from "react-router-dom";
 
const Notify = props => {
    moment.locale(navigator.languages[0].toLowerCase());

    
    const [showCount, setShowCount] = useState(false);
    const [messageCount, setMessageCount] = useState(0);
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const [raedIndex, setReadIndex] = useState(0);

    
    const ref = useRef(null);

    
    const data = props.data;
    const storageKey = props.storageKey || 'notification_timeline_storage_id';
    const key = props.notific_key;
    const notificationMsg = props.notific_value;
    const sortedByKey = props.sortedByKey;
    const heading = props.heading || 'Notifications';
    const bellSize = props.size || 32;
    const bellColor = props.color || '#FFFFFF';
    const multiLineSplitter = props.multiLineSplitter || '\n';
    const showDate = props.showDate || false;
    const UniqueKey = props.UniqueKey || 'id';
    const URLRedirect = props.URLRedirect

    useEffect(() => {
        if (!sortedByKey) {
            data.sort((a, b) => b[key] - a[key]);
        }


        let readItemLs = reactLocalStorage.getObject(storageKey);
        let readMsgId = Object.keys(readItemLs).length > 0 ? readItemLs['id'] : '';

        
        let readIndex = (readMsgId === '') ? data.length : data.findIndex(elem => elem[key] === readMsgId);

        
        readIndex = readIndex === -1 ? data.length : readIndex;

        setReadIndex(readIndex);

        
        (data.length && readIndex) > 0 ? setShowCount(true) : setShowCount(false);
        setMessageCount(readIndex);
    }, [data]);


    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    }


    const getDayDiff = timestamp => {
        let a = moment();
        let b = moment(timestamp);
        let diff = a.diff(b, 'year');
        if (diff === 0) {
            diff = a.diff(b, 'month');
            if (diff === 0) {
                diff = a.diff(b, 'days');
                if (diff === 0) {
                    diff = a.diff(b, 'hour');
                    if (diff === 0) {
                        diff = a.diff(b, 'minute');
                        if (diff === 0) {
                            diff = a.diff(b, 'second');
                            return `${diff} second(s) before`;
                        } else {
                            return `${diff} minute(s) before`;
                        }
                    } else {
                        return `${diff} hour(s) before`;
                    }
                } else {
                    return `${diff} days(s) before`;
                }
            } else {
                return `${diff} month(s) before`;
            }
        } else {
            return `${diff} year(s) before`;
        }
    };

    const getWhen = timestamp => {
        let when = `${moment(timestamp).format('L')} ${moment(timestamp).format('LTS')}`;
        return when;
    }

    // Get the notification message
    const getContent = message => {
        if (message.indexOf(multiLineSplitter) >= 0) {
            let splitted = message.split(multiLineSplitter);
            let ret = '<ul>';

            for (let i = 0; i <= splitted.length - 1; i++) {
                if (splitted[i] !== '') {
                    ret = ret + '<li>' + splitted[i] + '</li>';
                }
            }

            ret = ret + '</ul>';
            return {
                __html: ret
            };
        }
        return {
            __html: `<ul><li>${message}</li></ul>`
        };
    };


    const hide = () => {
        setShow(false);
    }

    
    const markAsRead = () => {
        setShowCount(false);
        reactLocalStorage.setObject(storageKey, { 'id': data[0][key] });
        setReadIndex(0);
    }
    
    // const history =props;
    let history = useHistory();
    const redirectURL = (message,e)=>{
        if(URLRedirect!=''||URLRedirect!=undefined)
        {
            // // history.push()
              history.push({
                  pathname: URLRedirect+"/"+message[UniqueKey],
                  state: {
                    message: message 
                  } 
               })
            // navigate()
            // navigate(URLRedirect+"/"+message[UniqueKey])
          
            console.log(message[UniqueKey]);
          //  props.history.push(URLRedirect +"/:id"+message[UniqueKey]);
            return true;
        }
    };

    return (
        <>
            <div className="notification-container">
                <div className={showCount ? 'notification notify show-count' : 'notification notify'}
                    data-count={messageCount}
                    onClick={event => handleClick(event)}>
                    <Bell color={bellColor} size={bellSize} />
                </div>
            </div>

            <div ref={ref}>
                <Overlay
                    show={show}
                    target={target}
                    placement="bottom"
                    container={ref.current}
                    containerPadding={20}
                    rootClose={true}
                    onHide={hide}
                >
                    <Popover id="popover-contained">
                        <Popover.Title as="h3">{heading}</Popover.Title>
                        <Popover.Content style={{ padding: '3px 3px' }}>
                            {showCount && <div>
                                <Button variant="link" onClick={markAsRead}>
                                    <BookOpen size={24} />
                                    Mark all as read
                                </Button>
                            </div>
                            }
                            <ul className="notification-info-panel">
                                {
                                    data.length > 0 ?
                                    
                                    data.map((message, index) =>
                                        <li
                                            className={index < raedIndex ? 'notification-message unread' : 'notification-message'}
                                            key={index}>
                                            <div className="timestamp">
                                                <span>{getDayDiff(message[key])}</span>
                                                {showDate && <span>{' ('}{getWhen(message[key])}{')'}</span>}
                                            </div>
                                            {/* <div onClick={event => redirectURL(message)} className="content" dangerouslySetInnerHTML={getContent(message[notificationMsg])} /> */}
                                            <div className="content" dangerouslySetInnerHTML={getContent(message[notificationMsg])} />
                                        </li>
                                    ) :
                                    <>
                                        <AlertTriangle color='#000000' size={32} />
                                        <h5 className="nodata">No Notifications found!</h5>
                                    </>
                                }
                            </ul>
                        </Popover.Content>
                    </Popover>
                </Overlay>
            </div>
        </>
    )
};

Notify.prototype = {
    storageKey: PropTypes.string,
    notific_key: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    notific_value: PropTypes.string.isRequired,
    sortedByKey: PropTypes.bool,
    color: PropTypes.string,
    size: PropTypes.string,
    heading: PropTypes.string,
    multiLineSplitter: PropTypes.string,
    showDate: PropTypes.bool//,
   // URLRedirect :PropTypes.string,
    //UniqueKey : PropTypes.string
}

export default Notify;