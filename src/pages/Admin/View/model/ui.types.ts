export type IViewValue = string | number | boolean | null;

export type IViewAttrExtend = {
    text: string;
    object: Record<string, string>;
};

export type IViewAttr = {
    description: string | IViewAttrExtend;
    value: IViewValue | IViewObject | IViewArray;
};

//

export type IViewArray = (IViewObject | IViewValue)[];

export type IViewObject = Record<string, IViewValue | IViewAttr>;
