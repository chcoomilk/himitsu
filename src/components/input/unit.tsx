const UnitInput
  = <T extends React.ReactNode & { length: number }>(
    { value, unit }: { value: T, unit: string }) => {
    return (
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: "10px",
        bottom: 0,
        pointerEvents: "none",
        overflow: "hidden",
        display: "flex",
        zIndex: 5,

        /* includes border width */
        padding: "7px 5px 5px 14px",
        color: "white",
        opacity: 0.8,
      }}>
        <span style={{ visibility: "hidden" }}>{value}</span>
        <span style={{ whiteSpace: "pre" }}>
          {value?.length > 0 && ` ${unit + (!isNaN(+value) && +value > 1 ? "s" : "")}`}
        </span>
      </div>
    );
  };

export default UnitInput;
