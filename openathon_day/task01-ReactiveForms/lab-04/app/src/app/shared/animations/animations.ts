import { trigger, style, animate, transition } from "@angular/animations";

//Object with all the animations
export const oeventsAnimations = {
  detailIn: trigger("detailIn", [
    transition(":enter", [
      style({
        opacity: 0,
        transform: "translateY(100%)",
      }),
      animate(
        ".75s ease-out",
        style({ opacity: 1, transform: "translateY(0)" })
      ),
    ]),
  ]),
  listIn: trigger("listIn", [
    transition(":enter", [
      style({
        opacity: 0,
        transform: "translateX(-100%)",
      }),
      animate("1s ease-in", style({ opacity: 1, transform: "translateX(0)" })),
    ]),
  ]),
  headerIn: trigger("headerIn", [
    transition(":enter", [
      style({
        opacity: 0,
        transform: "translateY(-100%)",
      }),
      animate(
        ".75s ease-out",
        style({ opacity: 1, transform: "translateY(0)" })
      ),
    ]),
  ]),
  addOut: trigger("addOut", [
    transition(":leave", [
      style({
        opacity: 1,
        transform: "translateX(0)",
      }),
      animate(
        "1s ease-out",
        style({ opacity: 0, transform: "translateX(100%)" })
      ),
    ]),
  ]),
};
