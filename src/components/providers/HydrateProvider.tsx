import { FC } from "react";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

type Props = {
  children: React.ReactNode;
  state: QueryClient;
};

const HydrateProvider: FC<Props> = ({ children, state }) => {
  const dehydratedState = dehydrate(state);
  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
};

export default HydrateProvider;
