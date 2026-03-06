
// This script is used to inject the NVIDIA API key into localStorage
(function() {
  const key = "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";
  localStorage.setItem('nvidiaApiKey', key);
  console.log('NVIDIA API Key injected successfully.');
})();
