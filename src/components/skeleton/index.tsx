import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.scss';

interface Props {
  isLoaded: boolean;
  selector?: string;
}

interface State {
  bg: any[];
  list: any[];
  listRadius: any[];
}

class Skeleton extends Component<Props, State> {
  static defaultProps = {
    isLoaded: false,
    selector: '.skeleton',
  };

  state = {
    bg: [],
    list: [],
    listRadius: [],
  };

  componentDidMount() {
    if (Taro.getEnv() === 'WEAPP') {
      this.weappSkl();
    } else {
      this.h5Skl();
    }
  }

  h5Skl() {
    const selObj = {
      bg: '.skeleton-bg',
      list: '.skeleton-rect',
      listRadius: '.skeleton-radius',
    };
    const selAll = selector => {
      const list = [];
      document.querySelectorAll(selObj[selector]).forEach((i: any) => {
        // @ts-ignore
        list.push(i.getBoundingClientRect());
      });
      // @ts-ignore
      this.setState({
        [selector]: list,
      });
    };
    setTimeout(() => {
      selAll('bg');
      selAll('list');
      selAll('listRadius');
    }, 300);
  }

  weappSkl() {
    const { selector } = this.props;
    Taro.createSelectorQuery()
      .selectAll(`${selector} >>> .skeleton-bg`)
      .boundingClientRect()
      .exec(res => {
        console.log(res);
        this.setState({ bg: res[0] });
      });

    Taro.createSelectorQuery()
      .selectAll(`${selector} >>> .skeleton-rect`)
      .boundingClientRect()
      .exec(res => {
        console.log({ res });
        this.setState({ list: res[0] });
      });

    Taro.createSelectorQuery()
      .selectAll(`${selector} >>> .skeleton-radius`)
      .boundingClientRect()
      .exec(res => {
        this.setState({ listRadius: res[0] });
      });
  }

  render() {
    const { list, bg, listRadius } = this.state;
    const { isLoaded } = this.props; // 是否加载完成
    return (
      <View>
        <View style={{ opacity: isLoaded ? 1 : 0 }}>{this.props.children}</View>
        {isLoaded ? (
          ''
        ) : (
          <View style={{ height: '100vh', backgroundColor: 'white' }}>
            {bg.map(item => {
              const { width, height, top, left } = item;
              return (
                <View
                  key={item}
                  style={{
                    background: 'white',
                    width: `${width}px`,
                    height: `${height}px`,
                    top: `${top}px`,
                    left: `${left}px`,
                    position: 'fixed',
                  }}
                />
              );
            })}
            {list.map(item => {
              const { width, height, top, left } = item;
              return (
                <View
                  key={item}
                  className='skeletonBg'
                  style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    top: `${top}px`,
                    left: `${left}px`,
                    position: 'fixed',
                  }}
                />
              );
            })}
            {listRadius.map(item => {
              const { width, height, top, left } = item;
              return (
                <View
                  key={item}
                  className='skeletonBg'
                  style={{
                    borderRadius: '50%',
                    width: `${width}px`,
                    height: `${height}px`,
                    top: `${top}px`,
                    left: `${left}px`,
                    position: 'fixed',
                  }}
                />
              );
            })}
          </View>
        )}
      </View>
    );
  }
}

export default Skeleton;
