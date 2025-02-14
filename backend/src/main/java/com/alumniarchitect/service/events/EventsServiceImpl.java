package com.alumniarchitect.service.events;

import com.alumniarchitect.entity.Events;
import com.alumniarchitect.repository.EventsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
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
        return eventsRepository.findById(id).orElse(null);
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
    public List<Events> findByDateBetween(String startDateStr, String endDateStr) {
        List<Events> eventsList = eventsRepository.findAll();
        LocalDate startDate = null;
        LocalDate endDate = null;

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        if (startDateStr != null && !startDateStr.isEmpty()) {
            try {
                startDate = LocalDate.parse(startDateStr, formatter);
            } catch (DateTimeParseException e) {
                System.err.println("Error parsing startDate: " + startDateStr + " - " + e.getMessage());
                return List.of();
            }
        }

        if (endDateStr != null && !endDateStr.isEmpty()) {
            try {
                endDate = LocalDate.parse(endDateStr, formatter);
            } catch (DateTimeParseException e) {
                System.err.println("Error parsing endDate: " + endDateStr + " - " + e.getMessage());
                return List.of();
            }
        }
        LocalDate finalStartDate = startDate;
        LocalDate finalEndDate = endDate;

        return eventsList.stream()
                .filter(e -> {
                    LocalDate eventDate = LocalDate.parse(e.getDate());
                    if (finalStartDate != null && finalEndDate != null) {
                        return !eventDate.isBefore(finalStartDate) && !eventDate.isAfter(finalEndDate);
                    } else if (finalStartDate != null) {
                        return !eventDate.isBefore(finalStartDate);
                    } else if (finalEndDate != null) {
                        return !eventDate.isAfter(finalEndDate);
                    } else {
                        return true;
                    }
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
}
