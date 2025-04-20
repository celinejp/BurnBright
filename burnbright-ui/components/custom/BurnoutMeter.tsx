export default function BurnoutMeter() {
    // This can be connected to backend later
    const score = 68;
  
    let color = "text-green-500";
    if (score > 70) color = "text-red-500";
    else if (score > 50) color = "text-yellow-500";
  
    return (
      <div className="my-4">
        <h2 className="text-lg font-medium">Current Burnout Score:</h2>
        <p className={`text-4xl font-bold ${color}`}>{score}%</p>
      </div>
    );
  }
  