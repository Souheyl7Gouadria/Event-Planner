import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEvents } from '../../util/http.js'; 
import LoadingIndicator from '../UI/LoadingIndicator.jsx';
import ErrorBlock from '../UI/ErrorBlock.jsx';
import EventItem from './EventItem.jsx';

export default function NewEventsSection() {
  // const [data, setData] = useState();
  // const [error, setError] = useState();
  // const [isLoading, setIsLoading] = useState(false);
  const {data , isPending , isError , error} = useQuery({
    queryKey: ['events', {max:3}],
    queryFn: ({signal , queryKey}) => fetchEvents({ signal, ...queryKey[1] }),  
    staleTime: 0, // thats default value , time interval in which tanstack will send to get updated data , if it finds data in the cache
    gcTime:  5*60*1000 // default is 5 min ,garbage collection time , controls how long the data in the cache will be kept
  })
  
  let content;

  if (isPending) {
    content = <LoadingIndicator />;
  }

  if (isError) {
    content = (
      <ErrorBlock title="An error occurred" message={error.info?.message || 'failed too fetch events'} />
    );
  }

  if (data) {
    content = (
      <ul className="events-list">
        {data.map((event) => (
          <li key={event.id}>
            <EventItem event={event} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <section className="content-section" id="new-events-section">
      <header>
        <h2>Recently added events</h2>
      </header>
      {content}
    </section>
  );
}
