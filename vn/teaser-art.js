// Keep generic portraits and authored acting on the same approved character art.
// Only presentation paths change; manuscript beats and save coordinates are shared.
export function withTeaserCharacterAssets(story, art) {
  const roles = {
    seoin: 'seoinStanding', jiwoo: 'jiwooRelaxed', mother: 'motherCare',
    doyun: 'doyunCanonical', hakyung: 'coreHakyung', reho: 'rehoCanonical', mira: 'miraCanonical',
  };
  const assets = {...story.assets};
  for (const [person, key] of Object.entries(roles)) {
    if (!art[key]) throw new Error('인물 원화가 없습니다: ' + key);
    assets[person] = art[key];
  }
  return {...story, assets};
}
