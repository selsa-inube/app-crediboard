export const getCanUnpin = (
  staffId: string,
  userWhoPinnedId: string,
  missionName: string,
  valueRule?: Record<string, string[]>
): boolean => {
  const isOwner = userWhoPinnedId === staffId;
  const isAuthorizedByRule =
    valueRule?.["PositionsAuthorizedToRemoveAnchorsPlacedByOther"]?.includes(
      missionName
    );
  return isOwner || (isAuthorizedByRule ?? false);
};
