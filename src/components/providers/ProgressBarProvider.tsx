'use client';

import { FC, Fragment, ReactNode } from 'react';
import { AppProgressBar as ProgressBar } from 'next-nprogress-bar';

const ProgressBarProvider: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <Fragment>
            {children}
            <ProgressBar
                height="4px"
                color="#fffd00"
                options={{ showSpinner: false }}
                shallowRouting
            />
        </Fragment>
    );
};

export default ProgressBarProvider;