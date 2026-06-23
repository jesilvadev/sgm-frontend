export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80">
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">{message}</p>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onCancel} className="px-3 py-1 text-gray-600">
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1bg-red-600 text-white rounded"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
