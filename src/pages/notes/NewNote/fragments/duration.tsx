import { Col, Form, InputGroup, Row } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import UnitInput from "../../../../components/input/Unit";
import { Fields } from "../formtypes";

const NewNoteDurationGroupForm = () => {
  const form = useFormContext<Fields>();
  const watch = form.watch();

  return (
    <Form.Group controlId="formBasicDuration" className="mb-4">
      <Form.Label>
        Duration
      </Form.Label>
      <Row className="gx-2 gy-2">
        <Form.Group as={Col} xs={6} xl={3}>
          <InputGroup hasValidation inputMode="numeric">
            <Form.Control
              disabled={form.formState.isSubmitting}
              aria-label="Day"
              type="text"
              inputMode="numeric"
              placeholder="2 days"
              {...form.register("duration.day", {
                // valueAsNumber: true,
                validate: {
                  type: v => isNaN(+v) ? "day should represent a number" : undefined,
                  gte: v => +v >= 0 || "day should be greater than 0",
                  /* @ts-ignore */
                  javascript_funny_moment: v => +v === 0 && v === "0" ? "day cannot be 0" : undefined,
                }
              })}
              isInvalid={form.formState.touchedFields.duration?.day && !!form.formState.errors.duration?.day}
              autoComplete="off"
            />
            { // not suppose to be like this, but no other choice
              !form.formState.errors.duration?.day
                ? <UnitInput value={watch.duration?.day?.toString()} unit="day" />
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
                  type: v => isNaN(+v) ? "hour should represent a number" : undefined,
                  // >= greater than or equal so when the user leave the input, this don't trigger
                  gte: v => +v >= 0 || "hour should be greater than 0",
                  // the actual equal 0 validation
                  // all of these because Number<empty string>("") === 0
                  /* @ts-ignore */
                  javascript_funny_moment: v => +v === 0 && v === "0" ? "hour cannot be 0" : undefined,
                }
              })}
              isInvalid={form.formState.touchedFields.duration?.hour && !!form.formState.errors.duration?.hour}
              autoComplete="off"
            />
            { // not suppose to be like this, but no other choice
              !form.formState.errors.duration?.hour
                ? <UnitInput value={watch.duration?.hour?.toString()} unit="hour" />
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
                  type: v => isNaN(+v) ? "minute should represent a number" : undefined,
                  gte: v => +v >= 0 || "minute should be greater than 0",
                  /* @ts-ignore */
                  javascript_funny_moment: v => +v === 0 && v === "0" ? "minute cannot be 0" : undefined,
                },
              })}
              isInvalid={form.formState.touchedFields.duration?.minute && !!form.formState.errors.duration?.minute}
              autoComplete="off"
            />
            { // not suppose to be like this, but no other choice
              !form.formState.errors.duration?.minute
                ? <UnitInput value={watch.duration?.minute?.toString()} unit="minute" />
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
                  type: v => isNaN(+v) ? "second should represent a number" : undefined,
                },
                min: {
                  value: !!(form.getValues("duration.day")
                    + form.getValues("duration.hour")
                    + form.getValues("duration.minute")
                  ) ? 0 : 30,
                  message: "second should be greater or equal 30"
                },
              })}
              isInvalid={form.formState.touchedFields.duration?.second && !!form.formState.errors.duration?.second}
              autoComplete="off"
            />
            { // not suppose to be like this, but no other choice
              !form.formState.errors.duration?.second
                ? <UnitInput value={watch.duration?.second?.toString()} unit="second" />
                : <Form.Control.Feedback type="invalid" tooltip>{form.formState.errors.duration?.second?.message}</Form.Control.Feedback>
            }
          </InputGroup>
        </Form.Group>
      </Row >
      <Form.Text muted>
        * Omit these fields to set it permanent
      </Form.Text>
    </Form.Group >
  );
};

export default NewNoteDurationGroupForm;
