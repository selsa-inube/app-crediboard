import { Fragment } from "react"
import { Stack, SkeletonLine } from "@inubekit/inubekit";

interface ISkeletons {
    index:number;
}

export function Skeletons(props: ISkeletons) {
    const { index } = props;

    return (
    <Fragment key={`keleton-credit-limi-${index}`}>
        <Stack justifyContent="space-between" alignItems="center">
            <SkeletonLine width="60%" height="24px" animated={true} />

            <Stack alignItems="center" gap="10px">
                <SkeletonLine width="80px" height="24px" animated={true} />
                <SkeletonLine width="16px" height="16px" animated={true} />
            </Stack>
        </Stack>
    </Fragment>
    );
} 