import { FormControl, OutlinedInput } from '@mui/material';

export default function Signup({ formState, handleChange }) {
  return (
    <FormControl variant="filled" size="small">
      <OutlinedInput
        placeholder="Your username"
        id="username-input"
        type="text"
        name="username"
        label="Username"
        defaultValue={formState.name}
        onChange={handleChange}
      ></OutlinedInput>
    </FormControl>
  );
}
