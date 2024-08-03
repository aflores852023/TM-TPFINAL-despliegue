/**
 * Obtiene la lista de espacios de trabajo desde el almacenamiento local.
 *
 * @return {Array} Un arreglo de objetos de espacio de trabajo, o null si no se encuentra ningún dato.
 */
export const getWorkspaces = () => {
    const workspaces_saved = localStorage.getItem('workspaces')
        if (workspaces_saved){
                return JSON.parse(workspaces_saved)   
      }
}

/**
 * Obtiene la lista de canales guardados en el almacenamiento local 
 * para los espacios de trabajo.
 *
 * @return {Array|null} Una matriz de objetos de canal si se encuentran 
 * canales guardados, o null si no hay canales guardados.
 */
export const getChannelsToWorkspaces = () => {
    const channels_saved = localStorage.getItem('channels')
        if (channels_saved){
                return JSON.parse(channels_saved)   
      }
}


/**
 * Recupera los canales asociados a un ID de espacio de trabajo específico desde 
 * los canales almacenados.
 *
 * @param {number} id - El ID del espacio de trabajo.
 * @return {Array} Un array de canales que pertenecen al espacio de trabajo con 
 * el ID especificado.
 */
export const getWorkspacesChannelForId = (id) => {
    const channels = getChannelsToWorkspaces(); 
  return channels.filter(channel => Number(channel.workspaceId) === Number(id));
};


export const deleteWorkspaceForId = (id) => {
    const workspaces = getWorkspaces();
    const index = workspaces.find(workspace => Number(workspace.id) === Number(id));
    workspaces.splice(index, 1);
    localStorage.setItem('workspaces', JSON.stringify(workspaces));
}