package com.alumniarchitect.service.events;

import com.alumniarchitect.entity.Events;
import com.alumniarchitect.request.events.EventsRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface EventsService {

    void save(Events events);
    Events findById(String id);
    List<Events> findAll();
    List<Events> findByEmailAll(String email);
    List<Events> findByDate(String date);
    List<Events> findByDateBetween(String startDate, String endDate);
    List<Events> findByFormat(String format);
    List<Events> findByCategory(String category);
    List<Events> findByEventType(String eventType);
    void delete(String id);

    List<Events> filter(EventsRequest eventsRequest);
}
