import classNames from "classnames";
import { useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../context/authContext";
import NotificationContext, {
  showErrorNotification,
  showSuccessNotification,
} from "../../context/notificationContext";
import inputStyles from "../Account/Form.module.css";
import Button from "../ui/Button";

interface FormUser {
  email: string;
}

interface Props {
  onClose: () => void;
}

const ChangeEmail = ({ onClose }: Props) => {
  const dispatch = useContext(NotificationContext);
  const { auth } = useAuth();

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormUser>({ defaultValues: { email: "" } });

  return (
    <form>
      <div
        className={classNames(inputStyles.field, inputStyles.fieldMaxWidth, {
          [inputStyles.fieldError]: errors.email,
        })}
      >
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email cannot be empty.",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "The email is not a valid email address.",
            },
          }}
          render={({ field }) => (
            <input
              type="email"
              placeholder="Email"
              className={inputStyles.input}
              {...field}
            />
          )}
        />
        {errors.email && (
          <div className={inputStyles.inputError}>{errors.email.message}</div>
        )}
      </div>
      <Button
        type="submit"
        isLoading={isSubmitting}
        onClick={handleSubmit(async ({ email }) => {
          const { error } = await auth.updateUser({ email });

          if (error) {
            dispatch(showErrorNotification(error.message));
            return;
          }

          dispatch(showSuccessNotification("Email send successfully"));
          reset();
          onClose();
        })}
      >
        Change Email
      </Button>
    </form>
  );
};

export default ChangeEmail;
