export const SvgIcon = ({
  src,
  className = "w-5 h-5",
  ...props
}: {
  src: string;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) => (
  <img src={src} alt="" className={className} {...props} />
);
