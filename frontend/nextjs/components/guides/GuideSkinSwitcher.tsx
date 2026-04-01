  return (
    <label className={`inline-flex items-center gap-2 text-xs ${className}`}>
      <span className="opacity-75">Дизайн:</span>
      <select
        value={currentSkin}
        onChange={(event) => onChange(event.target.value as GuideSkinId)}
        className="rounded-md border border-white/20 bg-black/20 px-2 py-1 text-xs light:border-gray-300 light:bg-white"
        aria-label="Выбор дизайна гайда"
      >
        {skins.map((skin) => (
          <option key={skin} value={skin}>
            {GUIDE_SKIN_LABELS[skin]}
          </option>
        ))}
      </select>
    </label>
  );
}
