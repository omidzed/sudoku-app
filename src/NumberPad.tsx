type Props = { onNumberClick: (clickedNumber:number) => void };

export const NumberPad = ({ onNumberClick }: Props) => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div>
      {numbers.map((number) => (
        <button
          key={number}
          onClick={() => onNumberClick(number)}
          className="bg-white text-blue-800 text-xl p-3 mx-0.5 border-white rounded-lg "
        >
          {number}
        </button>
      ))}
    </div>
  );
};
