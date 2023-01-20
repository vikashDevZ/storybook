let Modals = {};

/**
 * Set Modal Configs to open modals via modal Ids
 * @param modalConfigs
 */
function setModalScenes(modalConfigs) {
  Modals = {
    ...Modals,
    ...modalConfigs,
  };
}

/**
 * get Modal via Modal Ids
 * @param modalId
 * @returns {*}
 */
function getModalScene(modalId) {
  return Modals[modalId];
}

function registerModal(modalId, component) {
  Modals[modalId] = component;
}

export default {
  setModalScenes,
  getModalScene,
  registerModal,
};
