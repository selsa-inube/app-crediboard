export const voiceSearchConfig = {
  modal: {
    title: "Búsqueda por voz",
    width: "450px",
    buttons: {
      apply: "Aplicar",
      cancel: "Cancelar",
    },
  },
  states: {
    listening: "Escuchando...",
    instruction: "Presiona el micrófono para hablar",
  },
  errors: {
    notSupported: {
      title: "Reconocimiento de voz no disponible",
      message:
        "Tu navegador no soporta reconocimiento de voz. Por favor, usa un navegador compatible como Chrome, Edge o Safari.",
    },
  },
  accessibility: {
    microphoneButton: "Botón de micrófono para búsqueda por voz",
    listeningIndicator: "Indicador de escucha activa",
  },
};


export const speechRecognitionConfig = {
  language: "es-ES",
  continuous: true,
  interimResults: false
};


export const textProcessingConfig = {
  numberSpaceRegex: /(\d)\s+(\d)/g,
  cleanupPatterns: {
    extraSpaces: /\s+/g,
    leadingTrailing: /^\s+|\s+$/g
  }
};