import { useEffect } from "react";
import { Col, Form, FormGroupProps, InputGroup, Row } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { useLocation } from "react-router-dom";
import UnitInput from "../../../../components/input/Unit";
import { Fields } from "../formtypes";

const NewNoteDurationGroupForm = ({ ...attr }: FormGroupProps) => {
  const form = useFormContext<Fields>();
  const [
    day, hour, minute, second
  ] = form.watch([
    "duration.day",
    "duration.hour",
    "duration.minute",
    "duration.second"
  ]);

  const location = useLocation();

  useEffect(() => {
    location.state && JSON.parse(location.state)["focusOnDuration"] && form.setFocus("duration.second");
  }, [form, location.state]);

  useEffect(() => { // deadly dependency "form" will cause infinite loop, do not try!!
    form.trigger("duration.second");
  }, [day, hour, minute]); // eslint-disable-line
  // form will always be valid anyway

  return (
    <Form.Group {...attr}>
      <Form.Label htmlFor="duration.day">
        Duration
      </Form.Label>
      <Row className="gx-2 gy-2">
        <Form.Group as={Col} xs={6} xl={3}>
          <InputGroup hasValidation>
            <Form.Control
              id="duration.day"
              disabled={form.formState.isSubmitting}
              aria-label="Day"
              type="text"
              inputMode="numeric"
              placeholder="2 days"
              {...form.register("duration.day", {
                // problem assigning this as number is it will trigger the type
                // validation if the input is empty. I can set the default value
                // to be 0, but it will hide the placeholder and it just doesn't
                // look good in my opinion
                // valueAsNumber: true,
                validate: {
                  // @ts-expect-error
                  type: v => isNaN(+v) ? "day should represent a number" : undefined,
                  // >= greater than or equal so when the user leave the input, this don't trigger
                  // @ts-expect-error
                  gte: v => +v >= 0 || "day should be greater than 0",
                  // the actual equal 0 validation
                  // all of these because Number<empty string>("") === 0
                  // @ts-expect-error
                  javascript_funny_moment: v => +v === 0 && v === "0" ? "day cannot be 0" : undefined,
                }
              })}
              isInvalid={form.formState.touchedFields.duration?.day && !!form.formState.errors.duration?.day}
              autoComplete="off"
            />
            { // not supposed to be like this, but no other choice
              !form.formState.errors.duration?.day
                ? <UnitInput value={day?.toString()} unit="day" />
                : <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.duration?.day?.message}</Form.Control.Feedback>
            }
          </InputGroup>
        </Form.Group>

        <Form.Group as={Col} xs={6} xl={3}>
          <InputGroup hasValidation>
            <Form.Control
              disabled={form.formState.isSubmitting}
              aria-label="Hour"
              type="text"
              inputMode="numeric"
              placeholder="3 hours"
              {...form.register("duration.hour", {
                // valueAsNumber: true,
                validate: {
                  // @ts-expect-error
                  type: v => isNaN(+v) ? "hour should represent a number" : undefined,
                  // @ts-expect-error
                  gte: v => +v >= 0 || "hour should be greater than 0",
                  // @ts-expect-error
                  javascript_funny_moment: v => +v === 0 && v === "0" ? "hour cannot be 0" : undefined,
                }
              })}
              isInvalid={form.formState.touchedFields.duration?.hour && !!form.formState.errors.duration?.hour}
              autoComplete="off"
            />
            { // not supposed to be like this, but no other choice
              !form.formState.errors.duration?.hour
                ? <UnitInput value={hour?.toString()} unit="hour" />
                : <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.duration?.hour?.message}</Form.Control.Feedback>
            }
          </InputGroup>
        </Form.Group>

        <Form.Group as={Col} xs={6} xl={3}>
          <InputGroup hasValidation>
            <Form.Control
              disabled={form.formState.isSubmitting}
              aria-label="Minute"
              type="text"
              inputMode="numeric"
              placeholder="4 mins"
              {...form.register("duration.minute", {
                // valueAsNumber: true,
                validate: {
                  // @ts-expect-error
                  type: v => isNaN(+v) ? "minute should represent a number" : undefined,
                  // @ts-expect-error
                  gte: v => +v >= 0 || "minute should be greater than 0",
                  // @ts-expect-error
                  javascript_funny_moment: v => +v === 0 && v === "0" ? "minute cannot be 0" : undefined,
                },
              })}
              isInvalid={form.formState.touchedFields.duration?.minute && !!form.formState.errors.duration?.minute}
              autoComplete="off"
            />
            { // not supposed to be like this, but no other choice
              !form.formState.errors.duration?.minute
                ? <UnitInput value={minute?.toString()} unit="minute" />
                : <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.duration?.minute?.message}</Form.Control.Feedback>
            }
          </InputGroup>
        </Form.Group>

        <Form.Group as={Col} xs={6} xl={3}>
          <InputGroup hasValidation>
            <Form.Control
              disabled={form.formState.isSubmitting}
              aria-label="Second"
              type="text"
              inputMode="numeric"
              placeholder="5 secs"
              {...form.register("duration.second", {
                // valueAsNumber: true,
                validate: {
                  // @ts-expect-error
                  type: v => isNaN(+v) ? "second should represent a number" : undefined,
                },
                min: {
                  // @ts-expect-error
                  value: !!(form.getValues("duration.day")// @ts-expect-error
                    + form.getValues("duration.hour")// @ts-expect-error
                    + form.getValues("duration.minute")
                  ) ? 0 : 30,
                  message: "second should be greater or equal 30"
                },
                // this don't work unfortunately, maybe i did something wrong
                // don't know, my question didn't get answered
                // deps: ["duration.day", "duration"]
              })}
              isInvalid={form.formState.touchedFields.duration?.second && !!form.formState.errors.duration?.second}
              autoComplete="off"
            />
            { // not supposed to be like this, but no other choice
              !form.formState.errors.duration?.second
                ? <UnitInput value={second?.toString()} unit="second" />
                : <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.duration?.second?.message}</Form.Control.Feedback>
            }
          </InputGroup>
        </Form.Group>
      </Row >
    </Form.Group >
  );
};

export default NewNoteDurationGroupForm;
