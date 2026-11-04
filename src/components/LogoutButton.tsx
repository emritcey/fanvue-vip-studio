import { Button, LogoutIcon } from "@fanvue/ui";

export const LogoutButton = () => {
  return (
    <form action="/api/oauth/logout" method="post">
      <Button type="submit" variant="secondary" leftIcon={<LogoutIcon />}>
        Logout
      </Button>
    </form>
  );
};
