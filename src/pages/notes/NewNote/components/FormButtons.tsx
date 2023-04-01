import { Button, Spinner, Stack, StackProps } from "react-bootstrap";
import { useFormContext } from "react-hook-form";
import { Fields } from "../formtypes";
import { useNavigate } from "react-router-dom";

type Props = {
  buttonSize?: "sm" | "lg",
} & StackProps

const FormButtons = ({ buttonSize, ...attr }: Props) => {
  const form = useFormContext<Fields>();
  const navigate = useNavigate();

  return (
    <Stack {...attr}>
      <Button
        className="w-100"
        size={buttonSize}
        variant="outline-secondary"
        onClick={() => navigate("#options", { relative: "path" })}
      >
        Options
      </Button>
      <Button
        className="w-100"
        size={buttonSize}
        variant="outline-danger"
        onClick={() => navigate("#reset_form", { relative: "path" })} disabled={form.formState.isSubmitting}
      >
        Reset
      </Button>
      <Button
        className="w-100"
        size={buttonSize}
        variant="success"
        type="submit"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? <Spinner size="sm" animation="border" /> : "Save"}
      </Button>
    </Stack>
  );
};

export default FormButtons;
