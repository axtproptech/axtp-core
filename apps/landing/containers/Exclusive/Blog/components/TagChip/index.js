import Button from "common/components/Button";

const TagChip = ({ isActive, title, onClick = () => {} }) => (
  <Button
    variant="textButton"
    className="border-solid border-2 border-white"
    colors={isActive ? "warning" : "secondaryWithBg"}
    title={title}
    onClick={onClick}
  />
);

export default TagChip;
