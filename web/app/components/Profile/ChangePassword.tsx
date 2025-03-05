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
  password: string;
  confirmPassword: string;
}

interface Props {
  onClose: () => void;
}

const ChangePassword = ({ onClose }: Props) => {
  const dispatch = useContext(NotificationContext);
  const { auth } = useAuth();

  const {
    reset,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormUser>({
    defaultValues: { password: "", confirmPassword: "" },
  });

  return (
    <form>
      <div
        className={classNames(inputStyles.field, inputStyles.fieldMaxWidth, {
          [inputStyles.fieldError]: errors.password,
        })}
      >
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Password cannot be empty.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long.",
            },
          }}
          render={({ field }) => (
            <input
              type="password"
              placeholder="Password"
              className={inputStyles.input}
              {...field}
            />
          )}
        />
        {errors.password && (
          <div className={inputStyles.inputError}>
            {errors.password.message}
          </div>
        )}
      </div>
      <div
        className={classNames(inputStyles.field, inputStyles.fieldMaxWidth, {
          [inputStyles.fieldError]: errors.password,
        })}
      >
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Password cannot be empty.",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters long.",
            },
          }}
          render={({ field }) => (
            <input
              type="password"
              placeholder="Confirm password"
              className={inputStyles.input}
              {...field}
            />
          )}
        />
        {errors.password && (
          <div className={inputStyles.inputError}>
            {errors.password.message}
          </div>
        )}
      </div>
      <Button
        type="submit"
        isLoading={isSubmitting}
        onClick={handleSubmit(async ({ password, confirmPassword }) => {
          if (password !== confirmPassword) {
            dispatch(showErrorNotification("Passwords need to match"));
            reset();
            return;
          }

          const { error } = await auth.updateUser({ password });

          if (error) {
            dispatch(showErrorNotification(error.message));
            return;
          }

          dispatch(showSuccessNotification("Password changed successfully"));
          reset();
          onClose();
        })}
      >
        Change password
      </Button>
    </form>
  );
};

export default ChangePassword;
