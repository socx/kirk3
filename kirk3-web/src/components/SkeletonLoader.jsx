import '../css/additional-styles/skeleton-loader.css';


const SkeletonLoader = ({ type='rectangle', width='100%', height='120', count=1, isVertical=false }) => {
  const skeletons = [];

  for (let i = 0; i < count; i++) {
    skeletons.push(<div key={i} className={`${type}`} style={{height: height, width: width }} />);
  }
  return <div className={`skeleton ${isVertical ? 'vertical' : ''}`}>{skeletons}</div>;
};

export default SkeletonLoader;
