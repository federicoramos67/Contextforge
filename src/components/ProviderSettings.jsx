import { useState } from 'react';
import {
  getActiveProvider,
  getAvailableProviders,
  STORAGE_KEY,
  ACTIVE_PROVIDER_KEY,
} from '../config';
import { CONFIG_PROVIDERS, EMPTY_FORM } from '../constants/providers';

// Enmascara una key mostrando solo los últimos 4 caracteres
function maskKey(value) {
  if (!value || value.length <= 4) return value;
  return '••••••••' + value.slice(-4);
}

// Para Ollama muestra la URL completa (no es sensible); para el resto aplica máscara
function maskValue(id, value) {
  return id === 'ollama' ? value : maskKey(value);
}

// Panel de configuración de proveedores de IA.
// El estado que alimenta getActiveProvider() (savedKeys, selectedProviderId)
// vive en App y se recibe por props, para que el header y el modo IA se
// re-rendericen al guardar o borrar keys. Este componente solo posee su UI
// local efímera (formValues, configMessage).
export default function ProviderSettings({
  savedKeys,
  setSavedKeys,
  selectedProviderId,
  setSelectedProviderId,
  setUseAI,
  setCopiedMessage,
  onClose,
}) {
  const [formValues, setFormValues] = useState(EMPTY_FORM);
  // Mensaje de confirmación que se muestra dentro del panel antes de cerrarlo
  const [configMessage, setConfigMessage] = useState('');

  // Guarda las keys ingresadas en localStorage.
  // Los campos vacíos conservan el valor previo (no borran la key existente).
  function saveConfig() {
    const toSave = { ...savedKeys };

    for (const { id } of CONFIG_PROVIDERS) {
      if (formValues[id].trim()) {
        toSave[id] = formValues[id].trim();
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    setSavedKeys(toSave);
    setFormValues(EMPTY_FORM);

    const active = getActiveProvider();
    if (active) {
      // Muestra confirmación dentro del panel 1.2s antes de cerrarlo
      setConfigMessage(`✓ Proveedor activo: ${active.name}`);
      setTimeout(() => {
        onClose();
        setConfigMessage('');
      }, 1200);
    } else {
      onClose();
      setCopiedMessage('Sin proveedor activo — usando modo heurístico');
    }
  }

  // Elimina todas las keys guardadas en localStorage, incluyendo la selección manual
  function clearConfig() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_PROVIDER_KEY);
    setSavedKeys({});
    setFormValues(EMPTY_FORM);
    setSelectedProviderId('auto');

    const active = getActiveProvider();
    // Si no queda ningún proveedor activo, revertir al modo reglas
    if (!active) setUseAI(false);
    setCopiedMessage(
      active
        ? `Keys de UI borradas. Proveedor activo por .env: ${active.name}`
        : 'Keys borradas — sin proveedor activo. Usando modo heurístico.',
    );
  }

  const available = getAvailableProviders();

  return (
    <section className="config-panel panel">
      <h3>Proveedores de IA</h3>

      {/* Aviso de seguridad: las keys viven solo en el navegador del usuario */}
      <p className="config-security-note">
        🔒 Tu API key se guarda solo en este navegador (localStorage) y nunca se
        envía a nuestros servidores. Usá keys con límite de gasto.
      </p>

      {/* Selector de proveedor activo: visible cuando hay al menos uno configurado */}
      {available.length > 0 && (
        <div className="config-provider-select">
          <label htmlFor="cfg-active-provider">Proveedor activo:</label>
          <select
            id="cfg-active-provider"
            value={selectedProviderId}
            onChange={(e) => {
              const val = e.target.value;
              setSelectedProviderId(val);
              if (val === 'auto') {
                localStorage.removeItem(ACTIVE_PROVIDER_KEY);
              } else {
                localStorage.setItem(ACTIVE_PROVIDER_KEY, val);
              }
            }}
          >
            <option value="auto">Auto (prioridad)</option>
            {available.map(({ id, name }) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="config-grid">
        {CONFIG_PROVIDERS.map(({ id, label, type, placeholder }) => (
          <div key={id} className="config-field">
            <label htmlFor={`cfg-${id}`}>{label}</label>
            <input
              id={`cfg-${id}`}
              type={type}
              value={formValues[id]}
              onChange={(e) => setFormValues((v) => ({ ...v, [id]: e.target.value }))}
              placeholder={placeholder}
              autoComplete="off"
            />
            {savedKeys[id] && (
              <small className="config-saved">
                Guardada: {maskValue(id, savedKeys[id])}
              </small>
            )}
          </div>
        ))}
      </div>
      <div className="actions-row">
        <button className="primary-button" onClick={saveConfig}>Guardar</button>
        <button className="secondary-button" onClick={clearConfig}>Borrar todo</button>
      </div>
      {/* Confirmación transitoria que aparece al guardar una key válida */}
      {configMessage && <p className="config-confirm">{configMessage}</p>}
    </section>
  );
}
