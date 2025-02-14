package com.alumniarchitect.controller.algo;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Analytics {

    @Id
    private String id;
    private String title;
}
