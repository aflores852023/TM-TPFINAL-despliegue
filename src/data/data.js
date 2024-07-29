
/*  Datos de prueba */


export const users = [ 
    { id: 1, username: 'alice', avatar: 'https://example.com/avatar1.png', status: 'online' },
    { id: 2, username: 'bob', avatar: 'https://example.com/avatar2.png', status: 'offline' },
    { id: 3, username: 'charlie', avatar: 'https://example.com/avatar3.png', status: 'away' },
    { id: 4, username: 'dave', avatar: 'https://example.com/avatar4.png', status: 'busy' },
  ];
  
  export const workspaces = [
    { id: 1, name: 'Workspace One', members: [1, 2, 3] },
    { id: 2, name: 'Workspace Two', members: [2, 3, 4] },
  ];
  
  export const channels = [
    { id: 1, name: 'General', workspaceId: 1 },
    { id: 2, name: 'Random', workspaceId: 1 },
    { id: 3, name: 'Development', workspaceId: 2 },
    { id: 4, name: 'Design', workspaceId: 2 },
    { id: 5, name: 'Marketing', workspaceId: 3 }
  ];
  
  export  const messages = [
    { id: 1, text: 'Hello, everyone!', senderId: 1, channelId: 1, timestamp: new Date() },
    { id: 2, text: 'Hi Alice!', senderId: 2, channelId: 1, timestamp: new Date() },
    { id: 3, text: 'How is the project going?', senderId: 3, channelId: 3, timestamp: new Date() },
    { id: 4, text: 'We need to finish the design by Friday.', senderId: 4, channelId: 4, timestamp: new Date() },
    { id: 5, text: 'I am working on the backend now.', senderId: 1, channelId: 5, timestamp: new Date() },
  ];
  

