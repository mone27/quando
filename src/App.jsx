import { useEffect, useState} from 'react'
import React from 'react'
import { Calendar, momentLocalizer} from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'


// import FullCalendar, { formatDate } from '@fullcalendar/react'
// import { toMoment, toMomentDuration } from '@fullcalendar/moment'
// import timeGridPlugin from '@fullcalendar/timegrid'
// import interactionPlugin from '@fullcalendar/interaction'

import {BrowserRouter, Route, NavLink, Switch, Link} from "react-router-dom";

import firebase from "firebase";



let firebaseConfig = {
    apiKey: "AIzaSyDweP2M-lzNHqg-R4Fq-kjtcZ8yKdDEino",
    authDomain: "cuando-347e1.firebaseapp.com",
    databaseURL: "https://cuando-347e1.firebaseio.com",
    projectId: "cuando-347e1",
    storageBucket: "cuando-347e1.appspot.com",
    messagingSenderId: "1000921888211",
    appId: "1:1000921888211:web:b01527b54ec9534a5aeb26",
    measurementId: "G-Z50Q3H1310"
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
let database =  firebase.database();

const localizer = momentLocalizer(moment)


function App(props) {
        return (
        <BrowserRouter>
            <header className="header">
                <NavLink to="/">Home</NavLink>
                <div className='header-right'>
                    <NavLink to="/create">Create Poll</NavLink>
                </div>
            </header>
            <Switch>
                <Route path="/create" render={(props) => {return <CreatePoll history={props.history} match={props.match}/>}} />
                <Route path="/view/:pollId" render={(props) => {return <ViewPoll history={props.history} match={props.match}/>}} />
                <Route path="/" render={(props) => <Home history={props.history} match={props.match}/>} />
                <Route render={() => <h1>404: page not found</h1>} />
            </Switch>
        </BrowserRouter>
        )
}

class Home extends React.Component{
    constructor(props) {
        super(props);
        this.state = {polls: []}
    }
    render() {
        return(
            <div className='home'>
                Select a poll
                <ul>
                    {this.state.polls.map(poll =>
                        <li key={poll.key}><Link to={'/view/' + poll.key}>{poll.title}</Link></li>)}
                </ul>
            </div>)
    }
    componentDidMount() {
        database.ref('/polls').once('value').then((polls) => {
            polls = polls.val()
            let pollsList = []
            for (const key in polls){
                pollsList.push({key: key, title: polls[key].title})
            }
            this.setState({polls: pollsList})
        }, (error) => {
            console.log(error)
        })
    }
}

function CreatePoll(props){
    // let [events, setEvents] = useState([{title: 'first', start: '2020-10-23 10:00', end: '2020-10-23 12:00'}])
    let events = [{
        title: 'test',
        start: 'Mon Oct 19 2020 01:30:00 GMT+0200',
        end: 'Mon Oct 19 2020 03:30:00 GMT+0200'
        }]
    let [eventDuration, setEventDuration] = useState('01:00')

    function onSelect(selection) {
        console.log(selection)
        setEvents(selection.slots)
    }

    return (<div className='demo-app-main'>

                    <div>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            views={['week']}
                            defaultView = 'week'
                            style={{ height: 800}}
                            selectable={true}
                            onSelectSlot={onSelect}
                        />
                    </div>
                </div>
    )
}
// class CreatePoll extends React.Component {
//         calendarRef = React.createRef()
//
//         constructor(props) {
//                 super(props);
//                 this.eventDuration = "01:00"
//                 this.title = "First Poll"
//         }
//
//         render() {
//         return (
//             <div className='demo-app'>
//                 <CalendarSidebar changeEventDuration={this.changeEventDuration}
//                                  changeTitle={this.changeTitle}
//                                  title={this.title}
//                 />
//                 <div className='demo-app-main'>
//                     <FullCalendar
//                         plugins={[ timeGridPlugin, interactionPlugin]}
//
//                         ref={this.calendarRef}
//                         initialView='timeGridWeek'
//                         editable={true}
//                         selectable={true}
//                         select={this.handleDateSelect}
//                         events={this.props.events}
//                         eventContent={renderEventContent} // custom render function
//                         eventClick={this.handleEventClick}
//                         // eventAdd={this.handleEventChange}
//                         // eventChange={this.handleEventChange}
//                         // eventRemove={this.handleEventChange}
//                         headerToolbar={{
//                             left: 'prev,next today',
//                             center: 'title',
//                             right: 'timeGridWeek,timeGridDay'
//                         }}
//                         footerToolbar={{
//                             right: 'submitButton'
//                         }}
//                         customButtons={{
//                             submitButton: {
//                                 text: 'Create poll',
//                                 click: this.submitPoll
//                             }}
//                         }
//                     />
//                 </div>
//             </div>
//
//         )
//     }
//
//     // handlers for user actions
//     // ------------------------------------------------------------------------------------------
//
//     handleDateSelect = (selectInfo) => {
//         let calendarApi = this.calendarRef.current.getApi()
//         let title = "Event title"
//
//         calendarApi.unselect() // clear date selection
//         let start= toMoment(selectInfo.start, calendarApi)
//         let end= toMoment(selectInfo.end, calendarApi)
//         let duration = toMomentDuration(this.eventDuration)
//
//         calendarApi.batchRendering( () => {
//                 for (let event = start; event.isBefore(end); ) {
//             calendarApi.addEvent({
//                 title,
//                 start: event.format(),
//                 end: event.add(duration).format()
//             })
//         }})
//
//
//     }
//
//     handleEventClick = (clickInfo) => {
//             clickInfo.event.remove() // will render immediately. will call handleEventRemove
//     }
//
//     // handleEventChange = (AddInfo) => {
//     //     this.setState({events: this.calendarRef.current.getApi().getEvents()});
//     // }
//
//     changeEventDuration = (event) => {
//         this.eventDuration = event.target.value
//     }
//
//     submitPoll = () => {
//         let calendar = this.calendarRef.current.getApi().getEvents()
//         let events = calendar.map((event) => event.toPlainObject());
//         console.log(events)
//         let pollref = database.ref('/polls/').push()
//         pollref.set({
//             title: this.title,
//             events: events
//         }, (error) => {
//             console.log(error)
//         })
//         //this.props.history.push('/view/' + pollref.key);
//         this.props.history.push('/')
//     }
//
//     changeTitle = (event) => {
//         this.title = event.target.value
//     }
//
//
// }

function CalendarSidebar(props) {
    return (
        <div className='demo-app-sidebar'>
            <div className='demo-app-sidebar-section'>
                <label htmlFor="event-duration">Event duration</label>

                <select name="event-duration" onChange={props.changeEventDuration}>
                    <option value="01:00">1h</option>
                    <option value="02:00">2h</option>
                    <option value="03:00">3h</option>

                </select>
            </div>
            <div className='demo-app-sidebar-section'>
                <label>Insert Poll title</label>
                <input onChange={props.changeTitle} placeholder={props.title}/>
            </div>
        </div>
    )
}


function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
        </>
    )
}



class ViewPoll extends React.Component{

    // calendarRef = React.createRef()
    // title = React.createRef()
    // constructor(props) {
    //     super(props);
    //     this.selectedEvents = []
    // }
    //
    // render() {
    //     return (
    //         <div className='demo-app'>
    //             <div className='demo-app-main'>
    //                 <div className='center'>
    //                     <h1 ref={this.title}> Title </h1>
    //                 </div>
    //                 <FullCalendar
    //                     plugins={[ timeGridPlugin, interactionPlugin]}
    //                     ref={this.calendarRef}
    //                     initialView='timeGridWeek'
    //                     editable={false}
    //                     selectable={true}
    //                     select={this.handleDateSelect}
    //                     eventContent={renderEventContent} // custom render function
    //                     eventClick={this.handleEventClick}
    //                     headerToolbar={{
    //                         left: 'prev,next today',
    //                         center: 'title',
    //                         right: 'timeGridWeek,timeGridDay'
    //                     }}
    //                     footerToolbar={{
    //                         right: 'submitButton'
    //                     }}
    //                     customButtons={{
    //                         submitButton: {
    //                             text: 'Submit poll',
    //                             click: this.submitPoll
    //                         }}
    //                     }
    //                 />
    //             </div>
    //         </div>
    //
    //     )
    // }
    //
    // // handlers for user actions
    // // ------------------------------------------------------------------------------------------
    // componentDidMount = () => {
    //     let calendarApi = this.calendarRef.current.getApi()
    //     let poll = database.ref('/polls/' + this.props.match.params.pollId)
    //     poll.once('value').then((poll) => {
    //         this.title.current.innerHTML = poll.val().title;
    //         this.events = poll.val().events
    //         calendarApi.batchRendering( () => {
    //             poll.val().events.forEach((event) => {
    //                 calendarApi.addEvent({
    //                     start: event.start,
    //                     end: event.end
    //                 })
    //             })
    //         })
    //     })
    // }
    //
    // handleDateSelect = (selectInfo) => {
    //     let calendarApi = this.calendarRef.current.getApi()
    //     calendarApi.unselect() // clear date selection
    //     calendarApi.getEvents().forEach((event) =>{
    //         if (event.start >= selectInfo.start && event.end <= selectInfo.end){
    //             this.selectEvent(event)
    //         }
    //     })
    // }
    // handleEventClick = (clickInfo) => {
    //     let calendarApi = this.calendarRef.current.getApi()
    //     const index = this.selectedEvents.indexOf(clickInfo.event.start)
    //     if (index > -1) { //if event is selected unselect it
    //         this.unselectEvent(clickInfo.event)
    //     }
    //     else{
    //         this.selectEvent(clickInfo.event)
    //     }
    // }
    //
    // selectEvent = (event) =>{
    //     this.selectedEvents.push(event.start)
    //     event.setProp('backgroundColor', 'red')
    //     event.setProp('borderColor', 'red')
    //     console.log(`selected event ${event.start} `)
    // }
    // unselectEvent = (event) =>{
    //     const index = this.selectedEvents.indexOf(event.start)
    //     this.selectedEvents.splice(index, 1);
    //     event.setProp('backgroundColor', '#3788d8')
    //     event.setProp('borderColor', '#3788d8') // use CSS variable?
    //     console.log(`unselected ${event.start} `)
    // }
    //
    //
    //
    // submitPoll = () => {
    //     let userId = database.ref('/users/').push().key
    //     let pollId = this.props.match.params.pollId
    //     let events = this.events.map((event) =>{
    //         if (event.start in this.selectedEvents){
    //             event['available'][userId] = true
    //         }
    //         return event
    //     })
    //     console.log(this.even)
    //     database.ref('/polls/'+pollId+'/events/').set(
    //         events,
    //         err => console.log(err)
    //     )
    //     alert(`successfully submitted ${events.lenght} where you are available`)
    //     this.props.history.push('/');
    // }



}
export default App
