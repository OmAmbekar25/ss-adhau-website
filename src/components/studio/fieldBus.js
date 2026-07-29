/**
 * A one-line channel to the page's single particle field.
 *
 * StudioClient owns the scene; StudioJourney needs to move it along its
 * spine. The two are siblings under a server component, so there is no
 * prop to pass between them — this is the seam, deliberately as small as
 * it can be: one setter, one command, no state.
 */

let field = null;

export const attachField = (scene) => {
  field = scene;
};

export const story = (s) => {
  if (field) field.setStory(s);
};
