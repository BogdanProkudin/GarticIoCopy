import { render, fireEvent } from "@testing-library/react";
import WelcomeSelectAvatar from "./WelcomeSelectAvatar";
import "@testing-library/jest-dom";
describe("WelcomeSelectAvatar", () => {
  test("calls setActiveAvatarIndex with correct index when clicked", () => {
    const setActiveAvatarIndex = jest.fn();
    const avatarLink = "https://example.com/avatar.png";
    const index = 1;
    const activeAvatarIndex = 0;

    const { getByTestId } = render(
      <WelcomeSelectAvatar
        avatarLink={avatarLink}
        index={index}
        activeAvatarIndex={activeAvatarIndex}
        setActiveAvatarIndex={setActiveAvatarIndex}
      />
    );

    const avatarElement = getByTestId(`avatar-${index}`);
    fireEvent.click(avatarElement);

    expect(setActiveAvatarIndex).toHaveBeenCalledWith(index);
  });

  test("applies correct style when activeAvatarIndex matches index", () => {
    const setActiveAvatarIndex = jest.fn();
    const avatarLink = "https://example.com/avatar.png";
    const index = 1;
    const activeAvatarIndex = 1; // Setting activeAvatarIndex to match index

    const { getByTestId } = render(
      <WelcomeSelectAvatar
        avatarLink={avatarLink}
        index={index}
        activeAvatarIndex={activeAvatarIndex}
        setActiveAvatarIndex={setActiveAvatarIndex}
      />
    );

    const avatarElement = getByTestId(`avatar-${index}`);

    expect(avatarElement).toHaveStyle(`borderColor: #1791ff`);
  });
});
