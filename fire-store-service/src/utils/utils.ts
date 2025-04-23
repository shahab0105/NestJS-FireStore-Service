const getCollectionName = <T>(cls: new () => T): string => {
  return cls.name.toLocaleLowerCase() + 's';
};
