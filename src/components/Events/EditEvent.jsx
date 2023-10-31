import { Link, redirect, useNavigate,useParams, useSubmit, useNavigation } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import Modal from '../UI/Modal.jsx';
import EventForm from './EventForm.jsx';
import { fetchEvent, updateEvent,queryClient } from '../../util/http.js';
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
export default function EditEvent() {

  const params = useParams();
  const navigate = useNavigate();
  const {state} = useNavigation();

  // to use react Router in submit
  const submit = useSubmit();

  // creating a query for fetching events
  const {data ,isPending , isError , error} = useQuery({
    queryKey: ['events',params.id],
    queryFn:({signal}) => fetchEvent({signal, id:params.id }),
    staleTime:10000
  })


  // creating a mutation for updating event

  // const {mutate} = useMutation({
  //   mutationFn:updateEvent,
  //   onMutate: async (data) => {
  //     // first param of setQueryData is the queryKey to update and the second one is the new data 
  //     const newEvent = data.event;
  //     await queryClient.cancelQueries.cancelQueries({queryKey : ['events',params.id]});
  //     const previousEvent = queryClient.getQueryData(['events',params.id]) 

  //     queryClient.setQueryData(['events',params.id], newEvent);
  //     return{previousEvent};
  //   },
  //   // alternative to get previous data if the update fails in backend
  //   onError: (error , data , context) => {
  //     queryClient.setQueryData(['events',params.id] , context.previousEvent);
  //   },
  //   onSettled : () => {
  //     queryClient.invalidateQueries(['events',params.id]);
  //   }
  // })


  // submit using reactQuery  

  // function handleSubmit(formData) {
  //   mutate({id:params.id, event:formData});
  //   navigate('../');
  // }

  // submit using reactRouter
  function handleSubmit(formData) {
    submit(formData , {method : 'PUT'});
  }

  function handleClose() {
    navigate('../');
  }

  let content;

  if(isPending) {
    content = (
      <div>
        <LoadingIndicator/>
      </div>
    )
  }

  if(isError) {
    content = (
      <>
      <ErrorBlock title="failed to load events"  message={error.info?.message || "failed to load event"} />
      <div className='form-actions'> 
          <Link to ='../' className='button'>
            Okay
          </Link>
      </div>
    </>
    )
  }
  if (data) {
    content = (
      <EventForm inputData={data} onSubmit={handleSubmit}>
        {state === 'submitting' ? <p>sending data ... </p> : <>
          <Link to="../" className="button-text">
            Cancel
          </Link>
          <button type="submit" className="button">
            Update
          </button>
        </>}
      </EventForm>
    )
  }
  return (
    <Modal onClose={handleClose}>
      {content}
    </Modal>
  );
};

// outside the react component , it will resolve before the component gets executed
// fetchQuery return a promise , add return so the loader gets the promise 
export function loader({params}) {
  return queryClient.fetchQuery({
    queryKey: ['events',params.id],
    queryFn:({signal}) => fetchEvent({signal, id:params.id })
  })
};
// when we use fetchQuery in the loader , react Query will send that request and store the response data in the cache
// when we use useQuery in the component , the data will be retrieved from the cache


export async function action({request , params}) {
  const formData = await request.formData();
  const updatedEventData = Object.fromEntries(formData);
  await updateEvent({id:params.id , event :updatedEventData});
  await queryClient.invalidateQueries(['events']);
  return redirect('../')
}
