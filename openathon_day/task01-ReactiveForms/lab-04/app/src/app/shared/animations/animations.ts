import {
    trigger,
    style,
    animate,
    transition,
  } from "@angular/animations";
  
  export const animationTask = trigger("headerIn", [
    transition(":enter", [
      style({
        opacity: 0,
        transform: "translateY(-100%)",
      }),
      animate(".75s ease-out", style({ opacity: 1, transform: "translateY(0)" })),
    ]),
  ]);

  export const listIn = trigger("listIn", [
    transition(":enter", [
      style({
        opacity: 0,
        transform: "translateX(-100%)",
      }),
      animate("1s ease-in", style({ opacity: 1, transform: "translateX(0)" })),
    ]),
  ]);