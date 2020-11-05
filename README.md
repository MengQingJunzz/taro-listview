<h1 align="center" style="border-bottom: none;">📦🚀taro-listview</h1>
<p align="center">
<img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
<a href="https://www.npmjs.com/package/taro-listview">
  <img alt="npm latest version" src="https://img.shields.io/npm/v/taro-listview/latest.svg">
</a>
<img alt="GitHub Actions status" src="https://github.com/actions/toolkit/workflows/Main%20workflow/badge.svg" style="max-width:100%;">
</p>


- [x] 列表内部懒模块-解决小程序图片过多内存问题
- [ ] skeleton 拓展状态屏
- [ ] virtual-list(WIP)【虚拟列表】
- [x] 支持TaroV3 、NPM版本2.x.x

## 安装方式

> 安装：`npm i taro-listview`，`yarn add taro-listview`

## 使用案例

### 引入组件

[列表 Demo](https://github.com/Rahim-Chan/taro-listview/blob/master/src/pages/index/index.tsx)

!!!需给组件设置固定高度

### API

#### ListView

## 可配置参数

### 页面状态控制参数

| 属性              | 说明                                            | 类型              | 默认值                | 必传 |
| :---------------- | :---------------------------------------------- | :---------------- | :-------------------- | :--- |
| style             | -                                               | -                 | -                     | -    |
| lazy              | 开启懒加载(传入字符串为父元素 className 且开启) | boolean or string | false or '.lazy-view' | -    |
| hasMore           | 加载更多                                        | boolean           | true                  | true |
| isEmpty           | 展示空凭页                                      | boolean           | -                     | -    |
| isError           | 展示错误页                                      | boolean           | -                     | -    |
| needInit          | 初始化&自动调用下拉刷新方法                     | boolean           | -                     | -    |
| distanceToRefresh | 下拉刷新距离                                    | number            | -                     | -    |
| damping           | 最大下拉距离                                    | number            | -                     | -    |
| autoHeight        | 开启自适应高度                                  | boolean           | -                     | -    |
| lazyStorage       | Storage Key值用于区分ListView                  | string            | box                   | -    |

### 自定义页面 UI（状态提示语，空白屏、错误屏、底部状态的 UI 自定义）

| 属性                | 说明                                                             | 类型      | 默认值                                                                                                  | 必传 |
| :------------------ | :--------------------------------------------------------------- | :-------- | :------------------------------------------------------------------------------------------------------ | :--- |
| color               | 下拉加载时 loading 的颜色                                        | string    | #667baf                                                                                                 | -    |
| emptyText           | 空白页提示语                                                     | string    | -                                                                                                       | -    |
| footerLoaded        | 列表底部提示语                                                   | string    | -                                                                                                       |
| footerLoading       | 列表底部提示语                                                   | string    | 加载中                                                                                                  | -    |
| launch              | \*是否开启状态屏的渲染，状态屏节点对应以下 renderXX 属性（如下） | object    | `{ launchError = false, launchEmpty = false, launchFooterLoaded = false, launchFooterLoading = false }` | -    |
| renderError         | 错误页                                                           | Taro.Node | -                                                                                                       | -    |
| renderEmpty         | 空白页                                                           | Taro.Node | -                                                                                                       | -    |
| renderFooterLoaded  | 自定义底部加载完毕                                               | Taro.Node | -                                                                                                       | -    |
| renderFooterLoading | 自定义底部加载                                                   | Taro.Node | -                                                                                                       | -    |
| indicator           | 下拉提示语                                                       | Object    | `{ release = '加载中', activate = '下拉刷新', deactivate = '释放刷新'}`                                 | -    |

\*错误屏中重新初始化方法与下拉刷新方法一致

```jsx
import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import ListView, { LazyBlock } from "taro-listview";

const blankList = [
  {
    author: {},
    title: "this is a example"
  },
  {
    author: {},
    title: "this is a example"
  },
  {
    author: {},
    title: "this is a example"
  },
  {
    author: {},
    title: "this is a example"
  }
];

let pageIndex = 1;

export default class Index extends Component {
  state = {
    isLoaded: false,
    error: false,
    hasMore: true,
    isEmpty: false,
    list: blankList
  };

  getData = async (pIndex = pageIndex) => {
    if (pIndex === 1) this.setState({ isLoaded: false });
    const {
      data: { data }
    } = await Taro.request({
      url: "https://cnodejs.org/api/v1/topics",
      data: {
        limit: 10,
        page: pIndex
      }
    });
    console.log({ data });
    return { list: data, hasMore: true, isLoaded: pIndex === 1 };
  };

  componentDidMount() {
    this.refList.fetchInit();
  }

  pullDownRefresh = async () => {
    pageIndex = 1;
    const res = await this.getData(1);
    this.setState(res);
  };

  onScrollToLower = async fn => {
    const { list } = this.state;
    const { list: newList, hasMore } = await this.getData(++pageIndex);
    this.setState({
      list: list.concat(newList),
      hasMore
    });
    fn();
  };

  refList = {};

  insRef = node => {
    this.refList = node;
  };

  render() {
    const { isLoaded, error, hasMore, isEmpty, list } = this.state;
    return (
      <View className="skeleton lazy-view">
        <ListView
          lazy
          ref={node => this.insRef(node)}
          isLoaded={isLoaded}
          isError={error}
          hasMore={hasMore}
          style={{ height: "100vh" }}
          isEmpty={isEmpty}
          onPullDownRefresh={this.pullDownRefresh}
          onScrollToLower={this.onScrollToLower}
          lazyStorage='lazyView'
        >
          {list.map((item, index) => {
            return (
              <View className="item skeleton-bg" key={index}>
                <LazyBlock current={index} className="avatar" lazyStorage='lazyView'>
                  <Image
                    className="avatar skeleton-radius"
                    src={item.author.avatar_url}
                  />
                </LazyBlock>
                <View className="title skeleton-rect">{item.title}</View>
              </View>
            );
          })}
        </ListView>
      </View>
    );
  }
}
```

### 模块懒加载

1.模块需固定同一高度。

2.只能在 ListView 组件内使用，并开启 lazy 模式，且父元素的 className='lazy-view'!!!

3.组件需传入模块遍历后的下标。

#### API

##### LazyBlock
| 属性 | 说明                | 类型   |默认值   |必传   |
| :------- | :---------------  | :--------- |:--------- |:--------- |
| current   | 传入模块遍历后的下标    | number | null | true |
| lazyStorage   | Storage Key值用于区分ListView(获取是哪一个ListView)    | string | box | - |

```jsx
import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import ListView, { LazyBlock } from "taro-listView";

let pageIndex = 1;

export default class Index extends Component {
  state = {
    isLoaded: false,
    error: false,
    hasMore: true,
    isEmpty: false,
    list: []
  };

  getData = async (pIndex = pageIndex) => {
    if (pIndex === 1) this.setState({ isLoaded: false });
    const {
      data: { data }
    } = await Taro.request({
      url: "https://cnodejs.org/api/v1/topics",
      data: {
        limit: 10,
        page: pIndex
      }
    });
    return { list: data, hasMore: true, isLoaded: pIndex === 1 };
  };

  componentDidMount() {
    this.getData();
  }

  onScrollToLower = async fn => {
    const { list } = this.state;
    const { list: newList, hasMore } = await this.getData(++pageIndex);
    this.setState({
      list: list.concat(newList),
      hasMore
    });
    fn();
  };

  render() {
    const { isLoaded, error, hasMore, isEmpty, list } = this.state;
    return (
      <View className="lazy-view">
        <ListView
          lazy
          isLoaded={isLoaded}
          hasMore={hasMore}
          style={{ height: "100vh" }}
          onScrollToLower={this.onScrollToLower}
          lazyStorage='lazyViewBlock'
        >
          {list.map((item, index) => {
            return (
              <View className='item' key={index}>
                <LazyBlock current={index} className='avatar' lazyStorage='lazyViewBlock'>
                  <Image className='avatar' src={item.author.avatar_url} />
                </LazyBlock>
                <View className="title">{item.title}</View>
              </View>
            );
          })}
        </ListView>
      </View>
    );
  }
}
```

### 骨架屏

1.因骨架屏是捕捉已有占位数据的样式，再绘制出骨架，所以要先注入默认空白占位数据。

2.且需要一个传入父元素的 className(默认获取为“skeleton”），以便寻找元素下的所有“关节”元素。可通过传入 selector 参数自定义 className。

    有且只有捕捉以下提供的“关节”样式名：背景（'skeleton-bg'）、矩阵（'skeleton-rect'）、圆形（'skeleton-redius'）。

3.ListView 组件已嵌套 Skeleton 组件，直接调用对应属性即可。

\*“关节”元素需内容撑开，或者固定高度。

#### API

##### Skeleton

| 属性     | 说明                                  | 类型     | 默认值 | 必传 |
| :------- | :------------------------------------ | :------- | :----- | :--- |
| isLoaded | 骨架屏是否显示（eg:加载第一页时开启） | boolean  | false  | -    |
| selector | 骨架屏外层 class 名称                 | skeleton | -      | -    |

[骨架屏 Demo](https://github.com/Rahim-Chan/taro-listview/blob/master/src/pages/skeleton/index.tsx)

```jsx
import Taro, { useState } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { Skeleton } from "components";
import "./index.scss";

export default () => {
  const [isLoaded, setLoaded] = useState(false);
  return (
    <View>
      <Button onClick={() => setLoaded(!isLoaded)}>toggle</Button>
      <View className="skeleton">
        <Skeleton isLoaded={isLoaded}>
          {Array(4)
            .fill(1)
            .map(i => (
              <View className="item skeleton-bg" key={i}>
                <View className="avatar skeleton-radius" />
                <View className="title skeleton-rect">title</View>
              </View>
            ))}
        </Skeleton>
      </View>
    </View>
  );
};
```

### 方法参数

| 事件名称          | 说明             | 类型     | 默认值 | 必传 |
| :---------------- | :--------------- | :------- | :----- | :--- |
| onPullDownRefresh | 下拉刷新触发函数 | function | -      | -    |
| onScrollToLower   | 上拉底触发函数   | function | -      | -    |

```jsx
onPullDownRefresh = () => {
  getData();
};

onScrollToLower = async fn => {
  await getData();
  fn();
};
```
