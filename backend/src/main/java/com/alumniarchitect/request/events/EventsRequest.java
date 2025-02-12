package com.alumniarchitect.request.events;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EventsRequest {

    private String startDate;
    private String endDate;
    private String format;
    private String category;
    private String eventType;
}
