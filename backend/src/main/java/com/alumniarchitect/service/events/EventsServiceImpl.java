package com.alumniarchitect.service.events;

import com.alumniarchitect.entity.Events;
import com.alumniarchitect.repository.EventsRepository;
import com.alumniarchitect.request.events.EventsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventsServiceImpl implements EventsService {

    @Autowired
    private EventsRepository eventsRepository;

    @Override
    public void save(Events events) {
        eventsRepository.save(events);
    }

    @Override
    public Events findById(String id) {
        Optional<Events> events = eventsRepository.findById(id);

        return events.orElse(null);
    }

    @Override
    public List<Events> findAll() {
        return eventsRepository.findAll();
    }

    @Override
    public List<Events> findByDate(String date) {
        List<Events> eventsList = eventsRepository.findAll();

        return eventsList.stream()
                .filter(e -> e.getDate().equals(date))
                .toList();
    }

    @Override
    public List<Events> findByDateBetween(String startDate, String endDate) {
        List<Events> eventsList = eventsRepository.findAll();

        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        return eventsList.stream()
                .filter(e -> {
                    LocalDate eventDate = LocalDate.parse(e.getDate());
                    return !eventDate.isBefore(start) && !eventDate.isAfter(end);
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<Events> findByFormat(String format) {
        List<Events> eventsList = eventsRepository.findAll();

        return eventsList.stream()
                .filter(x -> x.getFormat().equals(format))
                .toList();
    }

    @Override
    public List<Events> findByCategory(String category) {
        List<Events> eventsList = eventsRepository.findAll();

        return eventsList.stream()
                .filter(x -> x.getCategory().equals(category))
                .toList();
    }

    @Override
    public List<Events> findByEventType(String type) {
        List<Events> eventsList = eventsRepository.findAll();

        return eventsList.stream()
                .filter(x -> x.getType().equals(type))
                .toList();
    }

    @Override
    public List<Events> findByEmailAll(String email) {
        return eventsRepository.findAllByEmail((email));
    }

    @Override
    public void delete(String id) {
        eventsRepository.deleteById(id);
    }

    @Override
    public List<Events> filter(EventsRequest eventsRequest) {
        List<Events> list = findByDateBetween(eventsRequest.getStartDate(), eventsRequest.getEndDate());

        return list.stream()
                .filter(x -> x.getCategory().equals(eventsRequest.getCategory()))
                .filter(x -> x.getType().equals(eventsRequest.getEventType()))
                .filter(x -> x.getFormat().equals(eventsRequest.getFormat()))
                .toList();
    }
}
