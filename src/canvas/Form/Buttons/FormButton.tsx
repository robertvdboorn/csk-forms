import React from 'react';

function FormButton({ label, type }: { label: string; type: 'submit' | 'reset' | 'button' }) {
  return (
    <div>
      <button
        type={type}
        className="bg-primary hover:bg-stone-900 text-white hover:text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline"
      >
        {label}
      </button>
    </div>
  );
}

export default FormButton;
