import { ErrorPage } from "../components/error-page/ErrorPage";

export default function NotFound() {
  return (
    <ErrorPage
      statusCode={404}
      title="Page not found"
      message="Looks like we can't find that page. Sorry!"
      actionLabel="Take me home"
      actionHref="/"
    />
  );
}
