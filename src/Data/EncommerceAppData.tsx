import { OnboardingPrograms } from "../TypesCheck/OnboardingTypesCheck";

export const OnboardingData: OnboardingPrograms[] = [
    {
        _id: "onboarding1",
        text: "Image 1",
        imageUrl: require("../../onboarding/cat404.json"),
        textColor: "#000080",
        backgroundColor: "rgba(25,232,127,1)",
    },
    {
        _id: "onboarding2",
        text: "Image 2",
        imageUrl: require("../../onboarding/panda.json"),
        textColor: "#000080",
        backgroundColor: "rgb(247,9,216)",
    },
];
