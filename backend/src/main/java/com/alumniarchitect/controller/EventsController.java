package com.alumniarchitect.controller;

import com.alumniarchitect.entity.Events;
import com.alumniarchitect.service.events.EventsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/api/events")
public class EventsController {

    @Autowired
    private EventsService eventsService;

    @PostMapping
    public ResponseEntity<String> addEvent(@RequestBody Events events) {
        eventsService.save(events);

        return new ResponseEntity<>("Event added", HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Events>> getAllEvents() {
        List<Events> eventsList = eventsService.findAll();

        return new ResponseEntity<>(eventsList, HttpStatus.OK);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<List<Events>> getEventsByEmail(@PathVariable String email) {
        List<Events> list = eventsService.findByEmailAll(email);

        if(list.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @GetMapping("/id/{id}")
    public ResponseEntity<Events> getEventById(@PathVariable String id) {
        Events events = eventsService.findById(id);

        return new ResponseEntity<>(events, HttpStatus.OK);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Events>> getEventsByDate(@PathVariable String date) {
        List<Events> eventsList = eventsService.findByDate(date);

        return new ResponseEntity<>(eventsList, HttpStatus.OK);
    }

    @GetMapping("/date-bet")
    public ResponseEntity<List<Events>> getEventsByDateRange(@RequestParam String startDate, @RequestParam String endDate) {
        List<Events> eventsList = eventsService.findByDateBetween(startDate, endDate);

        return new ResponseEntity<>(eventsList, HttpStatus.OK);
    }

    @GetMapping("/format/{format}")
    public ResponseEntity<List<Events>> getEventsByFormat(@PathVariable String format) {
        List<Events> eventsList = eventsService.findByFormat(format);

        return new ResponseEntity<>(eventsList, HttpStatus.OK);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Events>> getEventsByCategory(@PathVariable String category) {
        List<Events> eventsList = eventsService.findByCategory(category);

        return new ResponseEntity<>(eventsList, HttpStatus.OK);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<Events>> getEventsBytype(@PathVariable String type) {
        List<Events> eventsList = eventsService.findByEventType(type);

        return new ResponseEntity<>(eventsList, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable String id) {
        eventsService.delete(id);

        return new ResponseEntity<>("Event deleted", HttpStatus.OK);
    }
}
