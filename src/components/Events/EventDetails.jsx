import { Link, Outlet, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Header from '../Header.jsx';
import { fetchEvent, deleteEvent , queryClient } from '../../util/http.js';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from "../UI/Modal.jsx";
export default function EventDetails() {

  const [isDeleting,setDelete] =  useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const {data,isPending,isError,error} = useQuery({
    queryKey:['events' , params.id] ,
    queryFn:({signal}) =>fetchEvent({signal, id: params.id})}
  )

  const {mutate ,isPending:isPendingDel, isError:isErrorDel , error:deleteError} =  useMutation({
    mutationFn:deleteEvent,
    onSuccess:() => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType:'none',
      })
      navigate('/events');
    }
  })

  const handleStartDelete = () =>{
    setDelete(true);
  }

  const handleCancelDelete = () => {
    setDelete(false);
  }

  function HandleDelte() {
    mutate({id: params.id});
  }
  console.log(data);
  let content;
  if(isPending){
    content = (<div id='event-details-content'className='center'>
      <p>Fetching evnet data ...</p>
    </div>)
  }

  if(isError){
    content = <div id='event-details-content'className='center'>
    <ErrorBlock title='failed to fetch event' message={error.info?.message || 'failed to fetch event data'}/>
  </div>
  }
  if(data) {
    content = (
    <>
        <header>
          <h1>{data.title} </h1>
          <nav>
            <button onClick={handleStartDelete}>Delete</button>
            <Link to="edit">Edit</Link>
          </nav>
        </header>
        <div id="event-details-content">
        <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
        <div id="event-details-info">
          <div>
            <p id="event-details-location">{data.location}</p>
            <time dateTime={`Todo-DateT$Todo-Time`}>{data.date} @ {data.time}</time>
          </div>
          <p id="event-details-description">{data.description}</p>
        </div>
      </div>
    </>)
  }

  return (
    <>
      {isDeleting && (
        <Modal onClose={handleCancelDelete}>
        <h2>Are you sure ?</h2>
        <p>This action can not be undone</p>
        <div>
          {isPendingDel && <p>Deleting ...</p>}
          {!isPendingDel && (
            <>
            <button onClick={handleCancelDelete} className='button-text'>Cancel</button>
            <button onClick={HandleDelte} className='button'>Delete</button></>
          )}
        </div>
        {isErrorDel && <ErrorBlock title="failed to delete the event" message={deleteError.info?.message || "failed to delete event "} />}
      </Modal>
      )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
        {content}
      </article>
    </>
  );
}
