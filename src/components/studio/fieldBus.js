/**
 * A one-line channel to the page's single particle field.
 *
 * StudioClient owns the scene; StudioJourney needs to move it along its
 * spine. The two are siblings under a server component, so there is no
 * prop to pass between them — this is the seam, deliberately as small as
 * it can be: one setter, one command, no state.
 */

let fieldRef = null;
const waiting = new Set();

export const attachField = (scene) => {
  fieldRef = scene;
  waiting.forEach((cb) => cb(scene));
  waiting.clear();
};

/* The scene is mounted on an idle callback, so a section that needs to
   hand it measurements can easily be ready first. This fires immediately
   if the field is already up, and once on attach otherwise. */
export const onField = (cb) => {
  if (fieldRef) {
    cb(fieldRef);
    return () => {};
  }
  waiting.add(cb);
  return () => waiting.delete(cb);
};

export const story = (s) => {
  if (fieldRef) fieldRef.setStory(s);
};

/* the identity beat needs more than one command, so it takes the scene */
export const field = () => fieldRef;
