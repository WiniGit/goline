class ToolState {
    static move = "Move";
    static frame = "Frame";
    static rectangle = "Rectangle";
    static base_component = "BaseComponent";
    static text = "Text";
    static hand_tool = "HandTool";
    static resize_top_left = "ResizeTopLeft";
    static resize_top_right = "ResizeTopRight";
    static resize_bot_left = "ResizeBottomLeft";
    static resize_bot_right = "ResizeBottomRight";
    static resize_left = "ResizeLeft";
    static resize_right = "ResizeRight";
    static resize_top = "ResizeTop";
    static resize_bot = "ResizeBottom";


    static create_new_type = [
        this.frame,
        this.rectangle,
        this.base_component,
        this.text,
    ];

    static resize_type = [
        this.resize_top,
        this.resize_left,
        this.resize_right,
        this.resize_bot,
        this.resize_top_left,
        this.resize_top_right,
        this.resize_bot_left,
        this.resize_bot_right,
    ];
}

class EnumPermission {
    static owner = 0;
    static editer = 1;
    static viewer = 2;

    static get_namePermission(per) {
        switch (per) {
            case this.owner:
                return "Owner";
            case this.editer:
                return "Can edit";
            case this.viewer:
                return "Can view";
            default:
                return "Can view";
        }
    }
}

class ComponentState {
    static hover = "hover";
    static disabled = "disabled";
    static focus = "focus";
    static error = "error";
    static warning = "warning";
    static success = "success";

    static listState = [
        this.hover,
        this.disabled,
        this.focus,
        this.error,
        this.warning,
        this.success
    ];
}

class EnumCate {
    // Skin
    static color = 2;
    static style = 3;
    static typography = 17;
    static border = 361;
    static effect = 360;
    //
    // component
    static datePicker = 24;
    static button = 29;
    // static ? = 67;
    // static ? = 68;
    // static ? = 70;
    // static ? = 72;
    // static ? = 73;
    // static ? = 75;
    // static ? = 76;
    // static ? = 78;
    static checkbox = 79;
    static w_switch = 81;
    // static ? = 84;
    static textformfield = 85;
    static textfield = 86;
    // static ? = 89;
    static radio_button = 90;
    static tab = 91;
    static tab_bar = 92;
    static tab_view = 93;
    // static ? = 94;
    static progress_bar = 102;
    static progress_circle = 104;
    // static ? = 105;
    // static ? = 106;
    // static ? = 107;
    // static ? = 108;
    // static ? = 109;
    // static ? = 110;
    // static ? = 111;
    // static ? = 112;
    // static ? = 113;
    // static ? = 114;
    static svg = 115;
    static table = 117;
    // static ? = 118;
    // static ? = 119;
    static toolbar = 120;
    static form = 128;
    // static ? = 129;
    static frame = 362;
    static spacing = 363;
    static view = 134;
    static carousel = 136;
    static view_fullLayout = 135;
    static tool_rectangle = 138;
    static tool_text = 139;
    static tool_frame = 140;
    // static ? = 142;
    static tool_variant = 238;
    // static ? = 239;
    static chart = 240;
    static tree = 241;
    // static tab_bar = 242;

    static scale_size_component = [
        this.checkbox,
        this.w_switch,
        this.radio_button,
    ];

    static baseComponent = [
        this.button,
        this.w_switch,
        this.checkbox,
        this.radio_button,
        this.textformfield,
        this.textfield,
        this.table,
        this.tree,
        this.chart,
        this.carousel,
    ];

    static extend_frame = [this.tool_frame, this.form];

    static output_cate = [
        this.radio_button,
        this.w_switch,
        this.checkbox,
        this.textformfield
    ];

    static parent_cate = [
        this.tool_frame,
        this.form,
        this.textformfield,
        this.button,
        this.table,
        this.tree,
        this.carousel,
    ];

    static no_child_component = [
        this.tool_rectangle,
        this.tool_text,
        this.checkbox,
        this.progress_bar,
        this.progress_circle,
        this.radio_button,
        this.w_switch,
        this.svg
    ];

    static noImgBg = [this.svg, ...this.scale_size_component, this.table, this.tree, this.chart, this.carousel];

    static show_name = [this.tool_frame, this.form, this.tool_variant];

    static data_component = [this.tree, this.chart, this.carousel, this.table];
}

class AlignmentType {
    static top_left = "TopLeft";
    static top_center = "TopCenter";
    static top_right = "TopRight";
    static left_center = "LeftCenter";
    static center = "Center";
    static right_center = "RightCenter";
    static bottom_left = "BottomLeft";
    static bottom_center = "BottomCenter";
    static bottom_right = "BottomRight";
}

class Constraints {
    static top = "top";
    static bottom = "bottom";
    static left = "left";
    static right = "right";
    static top_bottom = "top_bottom";
    static left_right = "left_right";
    static center = "center";
    static scale = "scale";
}

class BorderSide {
    static all = "All";
    static left = "Left";
    static top = "Top";
    static right = "Right";
    static bottom = "Bottom";
    static custom = "Custom";
}

class BorderStyle {
    static solid = "solid";
    static dotted = "dotted";
    static dashed = "dashed";
    static double = "double";
    static groove = "groove";
    static inset = "inset";
    static inset = "ridge";
}

class TextAutoSize {
    static autoWidth = "Auto Width";
    static autoHeight = "Auto Height";
    static fixedSize = "Fixed Size";
}

class TextAlign {
    static left = "start";
    static center = "center";
    static right = "end";
}

class TextAlignVertical {
    static top = "start";
    static middle = "center";
    static bottom = "end";
}

class ShadowType {
    static dropdown = "Drop shadow";
    static inner = "Inner shadow";
    static layer_blur = "Layer blur";
}

class TableType {
    static header = 0;
    static only_body = 1;
    static header_footer = 2;
    static footer = 3;
}

class ChartType {
    static bar = "bar";
    static bubble = "bubble";
    static line = "line";
    static doughnut = "doughnut";
    static pie = "pie";
    static radar = "radar";
    static polar = "polarArea";

    static axes_chart = [this.bar, this.bubble, this.line];
    static list = [...this.axes_chart, this.doughnut, this.pie, this.radar, this.polar];
}

class ValidateType {
    static is_email = 0;
    static maxCharacter = 1;
    static minCharacter = 2;
    static is_number = 3;
    static is_phoneNumber = 4;
    static contain_special_character = 5;
    static contain_number = 6;
    static contain_uppercase = 7;
    static contain_lowercase = 8;
    static only_text = 9;
    static not_empty = 10;

    static typeName(typeNumber = 10) {
        let _typeName;
        switch (typeNumber) {
            case this.is_email:
                _typeName = "Email";
                break;
            case this.maxCharacter:
                _typeName = "Max character";
                break;
            case this.minCharacter:
                _typeName = "Min character";
                break;
            case this.is_number:
                _typeName = "Only number";
                break;
            case this.is_phoneNumber:
                _typeName = "Phone number";
                break;
            case this.contain_special_character:
                _typeName = "Contain special character";
                break;
            case this.contain_number:
                _typeName = "Contain number";
                break;
            case this.contain_lowercase:
                _typeName = "Contain lowercase";
                break;
            case this.contain_uppercase:
                _typeName = "Contain uppercase";
                break;
            case this.only_text:
                _typeName = "Only text";
                break;
            case this.not_empty:
                _typeName = "Not empty";
                break;
            default:
                break;
        }
        return _typeName;
    }
}

class KeyboardType {
    static datetime = "datetime";
    static email = "email";
    static multiline = "multiline";
    static name = "name";
    static none = "none";
    static number = "number";
    static phone = "phone";
    static address = "address";
    static text = "text";
    static url = "url";
    static visiblePassword = "visiblePassword";
}

class WDataType {
    static string = "string";
    static array = "array";
    static object = "object";
    static number = "number";
    static boolean = "boolean";
    static undefined = "undefined";
    static null = "null";

    static list = [
        this.string,
        this.array,
        this.object,
        this.number,
        this.boolean,
        this.null
        // this.undefined,
    ]
}

class WCarouselEffect {
    static fade = "fade";
    static easeInOut = "ease-in-out";
}

var hexRegex = /(#){0,1}[0-9A-Fa-f]{6,8}$/i;
var svgRegex = /(fill|stroke)="[^none](\w|\d|#){1,}"/g;
var brpRegex = /\(([^)-]+)\)/g;
var wbase_list = [];
var base_component_list = [];
var assets_list = [];
var selected_list = [];
var alt_list = [];
var copy_item;
var drag_start_list = [];
var action_list = [];
var action_index = -1;
var select_box;
var hover_wbase;
var hover_box;
var current_page = {
    ID: 2400,
    Name: "Page 1",
    ProjectID: 1,
    Permission: EnumPermission.owner,
};
var wbase_parentID = "019cc638-18b3-434d-8c4a-973537cde698";
var select_box_parentID = "019cc638-18b3-434d-8c4a-973537cde698";
var tool_state = ToolState.move;
var listDevice = [
    [
        {
            Name: 'Iphone 14',
            Height: 844,
            Width: 390
        },
        {
            Name: 'Iphone 14 Pro',
            Height: 852,
            Width: 393
        },
        {
            Name: 'Iphone 14 Plus',
            Height: 926,
            Width: 428
        },
        {
            Name: 'Iphone 14 Pro Max',
            Height: 932,
            Width: 430
        },
        {
            Name: 'Iphone 13',
            Height: 844,
            Width: 390
        },
        {
            Name: 'Iphone 13 Pro',
            Height: 844,
            Width: 390
        },
        {
            Name: 'Iphone 13 Pro Max',
            Height: 926,
            Width: 428
        },
        {
            Name: 'Iphone 13 Mini',
            Height: 812,
            Width: 375
        },
        {
            Name: 'Iphone SE',
            Height: 568,
            Width: 320
        },
        {
            Name: 'Iphone 8 Plus',
            Height: 736,
            Width: 414
        },
        {
            Name: 'Iphone 8 Plus',
            Height: 667,
            Width: 375
        },
        {
            Name: 'Android Small',
            Height: 640,
            Width: 360
        },
        {
            Name: 'Android Large',
            Height: 800,
            Width: 360
        },
    ],
    [
        {
            Name: 'Surface Pro 8',
            Height: 960,
            Width: 1440
        },
        {
            Name: 'Ipad Mini 8.3',
            Height: 1133,
            Width: 744
        },
        {
            Name: 'Ipad Pro 11"',
            Height: 1194,
            Width: 834
        },
        {
            Name: 'Ipad Pro 12.9"',
            Height: 1366,
            Width: 1024
        },
    ],
    [
        {
            Name: 'MacBook E',
            Height: 832,
            Width: 1280
        },
        {
            Name: 'MacBook Pro 14"',
            Height: 982,
            Width: 1512
        },
        {
            Name: 'MacBook Pro 16"',
            Height: 1117,
            Width: 1728
        },
        {
            Name: 'Desktop',
            Height: 1080,
            Width: 1920
        },
        {
            Name: 'Wireframes',
            Height: 1024,
            Width: 1440
        },
        {
            Name: 'TV',
            Height: 720,
            Width: 1280
        },
    ],
];


class WBaseDefault {
    static rectangle = {
        ListID: wbase_parentID,
        Level: 1,
        ParentID: wbase_parentID,
        IsShow: true,
        CateID: EnumCate.tool_rectangle,
        CountChild: 0,
        IsWini: false,
        PageID: current_page,
        ListChildID: [],
        StyleItem: {
            DecorationItem: {
                ColorValue: "FFC4C4C4",
            },
            FrameItem: {
                Width: 512.0,
                Height: 451.0,
                TopLeft: 0.0,
                TopRight: 0.0,
                BottomLeft: 0.0,
                BottomRight: 0.0,
                IsClip: true,
            },
            PositionItem: {
                Top: 222.0,
                Left: 110.0,
                Constraints: "left",
                ConstraintsY: "top",
                FixPosition: false,
            },
        },
        BasePropertyItems: [],
        AttributesItem: {
            NameField: "",
            Name: "Rectangle",
        },
        Name: "Rectangle",
    };

    static imgSvg = {
        ListID: wbase_parentID,
        Level: 1,
        ParentID: wbase_parentID,
        IsShow: true,
        CateID: EnumCate.svg,
        CountChild: 0,
        IsWini: false,
        PageID: current_page,
        ListChildID: [],
        StyleItem: {
            DecorationItem: {},
            FrameItem: {
                Width: 100.0,
                Height: 100.0,
                TopLeft: 0.0,
                TopRight: 0.0,
                BottomLeft: 0.0,
                BottomRight: 0.0,
                IsClip: true,
            },
            PositionItem: {
                Top: 222.0,
                Left: 110.0,
                ConstraintsX: "left",
                ConstraintsY: "top",
                FixPosition: false,
            },
        },
        BasePropertyItems: [],
        AttributesItem: {
            NameField: "",
            Name: "Svg Picture",
            Content: ""
        },
        Name: "Svg Picture",
    };

    static circle = {
        ListID: wbase_parentID,
        Level: 1,
        ParentID: wbase_parentID,
        IsShow: true,
        CateID: EnumCate.tool_rectangle,
        CountChild: 0,
        IsWini: false,
        PageID: current_page.ID,
        ListChildID: [],
        StyleItem: {
            DecorationItem: {
                ColorValue: "FFC4C4C4",
            },
            FrameItem: {
                Width: 512.0,
                Height: 451.0,
                IsClip: true,
            },
            PositionItem: {
                Top: 222.0,
                Left: 110.0,
                ConstraintsX: "left",
                ConstraintsY: "top",
                FixPosition: false,
            },
        },
        BasePropertyItems: [],
        AttributesItem: {
            NameField: "",
            Name: "circle",
        },
        Name: "circle",
    };

    static text = {
        ListID: wbase_parentID,
        Level: 1,
        ParentID: wbase_parentID,
        IsShow: true,
        CateID: EnumCate.tool_text,
        Sort: 1,
        CountChild: 0,
        IsWini: false,
        PageID: current_page.ID,
        ListChildID: [],
        StyleItem: {
            TextStyleItem: {
                FontSize: 24.0,
                FontWeight: "400",
                CateID: EnumCate.typography,
                IsStyle: false,
                ColorValue: "FF000000",
                LetterSpacing: 0,
                FontFamily: "Roboto",
                Name: "default",
            },
            TypoStyleItem: {
                AutoSize: TextAutoSize.autoWidth,
                TextAlign: TextAlign.left,
                TextAlignVertical: TextAlignVertical.middle,
            },
            FrameItem: {
                IsClip: true,
            },
            PositionItem: {
                Top: 0,
                Left: 0,
                ConstraintsX: "left",
                ConstraintsY: "top",
                FixPosition: false,
            },
            Name: "Text",
        },
        BasePropertyItems: [],
        AttributesItem: {
            NameField: "",
            Content: "",
            Name: "Text",
        },
        Name: "Text",
    };

    static frame = {
        ListID: wbase_parentID,
        Level: 1,
        ParentID: wbase_parentID,
        IsShow: true,
        CateID: EnumCate.tool_frame,
        CountChild: 0,
        IsWini: false,
        PageID: current_page.ID,
        ListChildID: [],
        StyleItem: {
            DecorationItem: {
                ColorValue: "FFFFFFFF",
            },
            FrameItem: {
                Width: 414.0,
                Height: 896.0,
                TopLeft: 0.0,
                TopRight: 0.0,
                BottomLeft: 0.0,
                BottomRight: 0.0,
                IsClip: true,
            },
            PositionItem: {
                Top: 0,
                Left: 0,
                ConstraintsX: "left",
                ConstraintsY: "top",
                FixPosition: false,
            },
        },
        BasePropertyItems: [],
        AttributesItem: {
            NameField: "",
            Name: "Frame",
            Content: ""
        },
        Name: "Frame",
    };

    static variant = {
        ListID: wbase_parentID,
        Level: 1,
        ParentID: wbase_parentID,
        IsShow: true,
        CateID: EnumCate.tool_variant,
        CountChild: 0,
        IsWini: true,
        PageID: current_page.ID,
        ListChildID: [],
        StyleItem: {
            DecorationItem: {
                BorderItem: {
                    Name: "new border",
                    BorderStyle: BorderStyle.dotted,
                    IsStyle: false,
                    ColorValue: "FF7B61FF",
                    BorderSide: BorderSide.all,
                    Width: "2 2 2 2",
                }
            },
            FrameItem: {
                Width: 414.0,
                Height: 896.0,
                TopLeft: 0.0,
                TopRight: 0.0,
                BottomLeft: 0.0,
                BottomRight: 0.0,
                IsClip: true,
            },
            PositionItem: {
                Top: 0,
                Left: 0,
                ConstraintsX: "left",
                ConstraintsY: "top",
                FixPosition: false,
            },
        },
        BasePropertyItems: [],
        AttributesItem: {
            NameField: "",
            Name: "Variant",
        },
        Name: "Variant",
    };

    static button = {
        ListID: wbase_parentID,
        Level: 1,
        ParentID: wbase_parentID,
        IsShow: true,
        CateID: EnumCate.button,
        CountChild: 0,
        IsWini: false,
        PageID: current_page,
        ListChildID: [],
        StyleItem: {
            DecorationItem: {
                ColorValue: "FF366AE2",
            },
            FrameItem: {
                TopLeft: 8.0,
                TopRight: 8.0,
                BottomLeft: 8.0,
                BottomRight: 8.0,
                IsClip: true,
            },
            PositionItem: {
                Top: 0.0,
                Left: 0.0,
                ConstraintsX: "left",
                ConstraintsY: "top",
                FixPosition: false,
            },
            PaddingItem: {
                Left: 20,
                Right: 20,
                Top: 12,
                Bottom: 12
            }
        },
        WAutolayoutItem: {
            Name: "new layout",
            Alignment: "Center",
            Direction: "Horizontal",
            ChildSpace: 4.0,
            IsScroll: false,
            IsWrap: false,
            RunSpace: 0.0,
            CountItem: 1,
        },
        BasePropertyItems: [],
        AttributesItem: {
            NameField: "Button",
            Name: "Button",
        },
        Name: "Button",
        JsonEventItem: [{
            Name: "State",
            ListState: [
                {
                    Type: ComponentState.hover,
                    ColorSkinID: '',
                    BorderSkinID: '',
                    EffectSkinID: '',
                },
            ]
        }]
    };

    static switch = {
        ListID: wbase_parentID,
        Level: 1,
        ParentID: wbase_parentID,
        IsShow: true,
        CateID: EnumCate.w_switch,
        CountChild: 0,
        IsWini: false,
        PageID: current_page,
        ListChildID: [],
        StyleItem: {
            DecorationItem: {
                ColorValue: "ff1890ff",
            },
            FrameItem: {
                Width: 60.0,
                Height: 40.0,
                IsClip: true,
            },
            PositionItem: {
                Top: 0.0,
                Left: 0.0,
            },
        },
        BasePropertyItems: [],
        AttributesItem: {
            NameField: "Switch",
            Name: "Switch",
            Content: "true"
        },
        Name: "Switch",
        JsonItem: {
            DotColor: "FFFFFFFF",
            InactiveColor: "FFF2F5F8",
            Enable: true,
        }
    };

    static checkbox = {
        Name: "Checkbox",
        ParentID: wbase_parentID,
        Level: 1,
        IsShow: true,
        PageID: current_page,
        ListID: wbase_parentID,
        CateID: EnumCate.checkbox,
        ListChildID: [],
        IsWini: false,
        CountChild: 0,
        StyleItem: {
            Name: null,
            PositionItem: {
                Right: 0,
                Bottom: 0,
            },
            FrameItem: {
                Width: 20,
                Height: 20,
                IsClip: true,
                TopLeft: 4,
                TopRight: 4,
                BottomLeft: 4,
                BottomRight: 4
            },
            DecorationItem: {
                ColorValue: "FF366AE2",
                BorderItem: {
                    Width: "2 2 2 2",
                    BorderStyle: BorderStyle.solid,
                    ColorValue: "FFE5EAF0",
                    IsStyle: false,
                    BorderSide: BorderSide.all
                },
            },
        },
        AttributesItem: {
            Name: "Checkbox",
            NameField: "Checkbox",
            Content: "true",
        },
        JsonItem: {
            CheckColor: "ffffffff",
            Enable: true,
            InactiveColor: "ff9e9e9e",
        }
    }

    static radio_button = {
        Name: "RadioButton",
        ParentID: wbase_parentID,
        Level: 1,
        IsShow: true,
        PageID: current_page,
        ListID: wbase_parentID,
        CateID: EnumCate.radio_button,
        ListChildID: [],
        IsWini: false,
        CountChild: 0,
        StyleItem: {
            PositionItem: {},
            FrameItem: {
                Width: 20,
                Height: 20,
            },
            DecorationItem: {
                ColorValue: "FF1890ff",
                BorderItem: {
                    Width: "2 2 2 2",
                    BorderStyle: BorderStyle.solid,
                    ColorValue: "FF2196F3",
                    IsStyle: false,
                    BorderSide: BorderSide.all
                },
            },
        },
        AttributesItem: {
            Name: "Radio button",
            NameField: "",
            Content: "",
        },
        JsonItem: {
            Enable: true,
        }
    }

    static textfield = {
        Name: "Textfield",
        ParentID: wbase_parentID,
        Level: 2,
        IsShow: true,
        CateID: EnumCate.textfield,
        ListChildID: [],
        IsWini: false,
        CountChild: 0,
        StyleItem: {
            ColorValue: "00FFFFFF",
        },
        AttributesItem: {
            Name: "Textfield",
            NameField: "Textfield",
            Content: "",
        },
    }

    static textformfield = {
        Name: "Textformfield",
        ParentID: wbase_parentID,
        Level: 1,
        IsShow: true,
        PageID: current_page,
        ListID: wbase_parentID,
        CateID: EnumCate.textformfield,
        ListChildID: [],
        IsWini: false,
        CountChild: 0,
        StyleItem: {
            PositionItem: {
                Right: 0,
                Bottom: 0,
            },
            FrameItem: {
                Width: 382,
                IsClip: true,
                TopLeft: 8,
                TopRight: 8,
                BottomLeft: 8,
                BottomRight: 8
            },
            PaddingItem: {
                Top: 10,
                Left: 16,
                Bottom: 10,
                Right: 16
            },
            DecorationItem: {
                ColorValue: "FFFFFFFF",
                BorderItem: {
                    Width: "1 1 1 1",
                    BorderStyle: BorderStyle.solid,
                    ColorValue: "FFE5EAF0",
                    IsStyle: false,
                    BorderSide: BorderSide.all
                },
            },
            TextStyleItem: {
                FontSize: 16,
                FontWeight: "400",
                CateID: EnumCate.typography,
                IsStyle: false,
                ColorValue: "FF394960",
                LetterSpacing: 0,
                FontFamily: "Roboto",
                Height: 24
            },
            TypoStyleItem: {
                TextAlign: TextAlign.left,
                TextAlignVertical: TextAlignVertical.middle,
            },
        },
        AttributesItem: {
            Name: "Textformfield",
            NameField: "Textformfield",
            Content: "",
        },
        WAutolayoutItem: {
            Alignment: "Center",
            Direction: "Horizontal",
            ChildSpace: 4.0,
            IsScroll: false,
            IsWrap: false,
            RunSpace: 0.0,
            CountItem: 1,
        },
        JsonItem: {
            LabelText: "Label",
            AutoFocus: false,
            Enabled: true,
            ReadOnly: false,
            IsImportant: false,
            KeyboardType: null,
            ObscureText: false,
            ObscuringCharacter: "*",
            MaxLength: null,
            HintText: "Placeholder",
            MaxLines: 1,
            TextCapitalization: null,
            JsonVadidate: [],
            AutoValidate: false,
        },
        JsonEventItem: [
            {
                Name: "State",
                ListState: [
                    {
                        Type: ComponentState.focus,
                        ColorSkinID: '',
                        BorderSkinID: '',
                        EffectSkinID: '',
                    }
                ]
            }
        ]
    }

    static table = {
        Name: "Table",
        ParentID: wbase_parentID,
        Level: 1,
        IsShow: true,
        PageID: current_page,
        ListID: wbase_parentID,
        CateID: EnumCate.table,
        ListChildID: [],
        IsWini: false,
        CountChild: 0,
        StyleItem: {
            PositionItem: {
                Right: 0,
                Bottom: 0,
            },
            FrameItem: {
                Height: 112,
                Width: 360,
                IsClip: true,
                TopLeft: 8,
                TopRight: 8,
                BottomLeft: 8,
                BottomRight: 8
            },
            DecorationItem: {
                ColorValue: "FFFFFFFF",
                BorderItem: {
                    Width: "1 1 1 1",
                    BorderStyle: BorderStyle.solid,
                    ColorValue: "FFE5EAF0",
                    IsStyle: false,
                    BorderSide: BorderSide.all
                },
            },
            PaddingItem: {
                Top: 8,
                Left: 8,
                Bottom: 8,
                Right: 8
            },
        },
        WAutolayoutItem: {
            Alignment: "Center",
            Direction: "Vertical",
            ChildSpace: 0.0,
            IsScroll: false,
            IsWrap: false,
            RunSpace: 0.0,
            CountItem: 1,
        },
        AttributesItem: {
            Name: "Table",
            NameField: "Table",
            Content: "",
        },
        JsonItem: {
            ColBorderWidth: 1,
            RowBorderWidth: 1,
        },
        JsonEventItem: [],
        TableRows: [
            [
                {
                    ID: "1x1",
                    contentid: "",
                    RowSpan: 1,
                    ColSpan: 1
                },
                {
                    ID: "1x2",
                    contentid: "",
                    RowSpan: 1,
                    ColSpan: 1
                }
            ],
            [
                {
                    ID: "2x1",
                    contentid: "",
                    RowSpan: 1,
                    ColSpan: 1
                },
                {
                    ID: "2x2",
                    contentid: "",
                    RowSpan: 1,
                    ColSpan: 1
                }
            ],
        ]
    }

    static tree = {
        Name: "Tree",
        ParentID: wbase_parentID,
        Level: 1,
        IsShow: true,
        PageID: current_page,
        ListID: wbase_parentID,
        CateID: EnumCate.tree,
        ListChildID: [],
        IsWini: false,
        CountChild: 0,
        StyleItem: {
            PositionItem: {
                Right: 0,
                Bottom: 0,
            },
            FrameItem: {
                Width: 360,
                IsClip: true,
                TopLeft: 0,
                TopRight: 0,
                BottomLeft: 0,
                BottomRight: 0
            },
            DecorationItem: {
                ColorValue: "FFFFFFFF",
            },
            PaddingItem: {
                Top: 10,
                Left: 24,
                Bottom: 10,
                Right: 24
            },
        },
        WAutolayoutItem: {
            Alignment: "Center",
            Direction: "Horizontal",
            ChildSpace: 12.0,
            IsScroll: false,
            IsWrap: false,
            RunSpace: 0.0,
            CountItem: 1,
        },
        AttributesItem: {
            Name: "Tree",
            NameField: "Tree",
            Content: "",
        },
        JsonItem: {
            ActionPosition: "right",
            ActionType: "chevron",
            ActionColor: "FF1e3050",
            ActionSize: 20,
            IndentSpace: 16,
        },
        JsonEventItem: [],
        TreeData: {
            ID: 0,
            Level: 0,
            Title: "Level 1",
            IsSelect: true,
            ChildrenItem: [
                {
                    ID: 1,
                    Level: 1,
                    ParentID: 0,
                    Title: "Level 2",
                    IsSelect: true,
                    ChildrenItem: [],
                },
                {
                    ID: 2,
                    Level: 1,
                    ParentID: 0,
                    Title: "Level 2",
                    IsSelect: true,
                    ChildrenItem: [
                        {
                            ID: 3,
                            Level: 2,
                            ParentID: 2,
                            Title: "Level 3",
                            IsSelect: true,
                            ChildrenItem: [],
                        }
                    ],
                }
            ],
        }
    }

    static chart = {
        Name: "Chart",
        ParentID: wbase_parentID,
        Level: 1,
        IsShow: true,
        PageID: current_page,
        ListID: wbase_parentID,
        CateID: EnumCate.chart,
        ListChildID: [],
        IsWini: false,
        CountChild: 0,
        StyleItem: {
            PositionItem: {
                Right: 0,
                Bottom: 0,
            },
            FrameItem: {
                Width: 400,
                Height: 200,
                IsClip: true,
                TopLeft: 0,
                TopRight: 0,
                BottomLeft: 0,
                BottomRight: 0
            },
            DecorationItem: {},
            TextStyleItem: {
                FontSize: 14,
                FontWeight: "500",
                CateID: EnumCate.typography,
                IsStyle: false,
                ColorValue: "FF394960",
                FontFamily: "Roboto",
            }
        },
        AttributesItem: {
            Name: "Chart",
            NameField: "Chart",
            Content: "",
        },
        JsonItem: {
            Type: ChartType.bar,
            HoverOffset: 4,
            MaxValue: 5,
            StepSize: 1
        },
        JsonEventItem: [],
        ChartData: {
            labels: ["A", "B", "C"],
            datasets: [
                {
                    label: "Dataset 1",
                    data: [1, 2, 3],
                    backgroundColor: [
                        "#36a2ebff",
                        "#ff6384ff",
                        "#ffcd56ff",
                    ],
                    borderColor: [],
                    borderWidth: [],
                },
                {
                    label: "Dataset 2",
                    data: [2, 3, 4],
                    backgroundColor: [
                        "#36a2ebff",
                        "#ff6384ff",
                        "#ffcd56ff",
                    ],
                    borderColor: [],
                    borderWidth: [],
                },
            ],
        }
    }

    static carousel = {
        Name: "Carousel",
        ParentID: wbase_parentID,
        Level: 1,
        IsShow: true,
        PageID: current_page,
        ListID: wbase_parentID,
        CateID: EnumCate.carousel,
        ListChildID: [],
        IsWini: false,
        CountChild: 0,
        StyleItem: {
            PositionItem: {
                Right: 0,
                Bottom: 0,
            },
            FrameItem: {
                Width: 200,
                Height: 100,
                IsClip: true,
                TopLeft: 0,
                TopRight: 0,
                BottomLeft: 0,
                BottomRight: 0
            },
            DecorationItem: {
            },
            PaddingItem: {
                Top: 8,
                Left: 8,
                Bottom: 8,
                Right: 8
            },
        },
        WAutolayoutItem: {
            Alignment: "Center",
            Direction: "Horizontal",
            ChildSpace: 12.0,
            IsScroll: false,
            IsWrap: false,
            RunSpace: 0.0,
            CountItem: 1,
        },
        AttributesItem: {
            Name: "Carousel",
            NameField: "Carousel",
            Content: "",
        },
        JsonItem: {
            Effect: WCarouselEffect.easeInOut,
            ActionType: "chevron",
            ActionColor: "ff1b1b1b",
            ActionSize: 24,
            ActionBackground: "bff6f6f6",
            TransitionTime: 3000,
            TransformTime: 500,
            AutoPlay: true
        },
        JsonEventItem: [],
        CarouselData: {
            initSlide: 0,
            slides: [
                {
                    background: "https://images2.thanhnien.vn/Uploaded/dotuan/2022_07_04/1-7418.jpg",
                    title: "slide 1"
                },
                {
                    background: "https://s3.cloud.cmctelecom.vn/tinhte1/2014/11/2631443_despicable_me_2_minions-1920x1080_VVVaaa.png",
                    title: "slide 2"
                },
                {
                    background: "https://images2.thanhnien.vn/Uploaded/quynhnhu/2015_07_13/watch-minions-trailer_HKTM.jpg?width=500",
                    title: "slide 3"
                },
            ]
        }
    }
}
class WBaseDA {
    static wbase_url = domainApi + "/WBase/ListItem";
    static base_item_url = domainApi + "/WBase/listBaseitem";
    static skin_url = domainApi + "/Style/ListCacheItem";
    static enumEvent;
    static listData = [];
    static isCtrlZ = false;

    static add(list_wbase_item, pageid, enumEvent = EnumEvent.add, enumObj = EnumObj.wBase) {
        let data = {
            enumObj: enumObj,
            data: list_wbase_item,
            enumEvent: enumEvent,
            pageid: pageid
        };
        WiniIO.emitMain(data);
    }

    static edit(list_wbase_item, enumObj, isEditText = false) {
        if (!WBaseDA.isCtrlZ && !isEditText) {
            addAction();
        }
        if (selected_list.length > 0)
            reloadTree(selected_list[0].value);
        let data = {
            enumObj: enumObj ?? EnumObj.wBase,
            data: list_wbase_item,
            enumEvent: EnumEvent.edit,
        };
        WiniIO.emitMain(data);
    }

    static editBaseComponent(list_wbase_item, enumObj) {
        let data = {
            enumObj: enumObj ?? EnumObj.wBase,
            data: list_wbase_item,
            enumEvent: EnumEvent.edit,
            pageid: 0
        };
        WiniIO.emitMain(data);
    }

    static unDelete(list_wbase_item) {
        let data = {
            enumObj: EnumObj.wBase,
            data: list_wbase_item,
            enumEvent: EnumEvent.unDelete,
        };
        WiniIO.emitMain(data);
    }

    static delete(delete_list) {
        if (delete_list.length > 0) {
            let enumObj;
            let parentWbase;
            if (delete_list[0].ParentID != wbase_parentID) {
                parentWbase = wbase_list.find(wbaseItem => wbaseItem.GID == delete_list[0].ParentID);
                if (parentWbase) {
                    parentWbase.ListChildID = parentWbase.ListChildID.filter(id => delete_list.every(deleteItem => deleteItem.GID != id));
                    parentWbase.CountChild = parentWbase.ListChildID.length;
                    let parentHTML = parentWbase.value;
                    if (parentWbase.CountChild == 0 && parentWbase.WAutolayoutItem) {
                        if (parentHTML.style.width == "fit-content") {
                            enumObj = EnumObj.frame;
                            parentHTML.style.width = parentHTML.offsetWidth + "px";
                            parentWbase.StyleItem.FrameItem.Width = parentHTML.offsetWidth;
                        }
                        if (parentHTML.style.height == "fit-content") {
                            enumObj = EnumObj.frame;
                            parentHTML.style.height = parentHTML.offsetHeight + "px";
                            parentWbase.StyleItem.FrameItem.Height = parentHTML.offsetHeight;
                        }
                    }
                }
            }
            wbase_list = wbase_list.filter(e => !delete_list.some(delete_item => delete_item.GID == e.GID || e.ListID.includes(delete_item.GID)));
            switch (parentWbase?.CateID) {
                case EnumCate.tree:
                    reloadTree(delete_list[0].value);
                    break;
                case EnumCate.table:
                    parentWbase.TableRows.
                        reduce((a, b) => a.concat(b)).
                        filter(cell => delete_list.some(deleteItem => cell.contentid.includes(deleteItem.GID))).
                        forEach(cell => {
                            let newListContentID = cell.contentid.split(",").filter(id => delete_list.every(deleteItem => deleteItem.GID !== id));
                            cell.contentid = newListContentID.join(",");
                        });
                    enumObj = enumObj === EnumObj.frame ? EnumObj.attributeFrame : EnumObj.attribute;
                    break;
                default:
                    break;
            }
            for (let wbaseItem of delete_list) {
                wbaseItem.IsDeleted = true;
                if (wbaseItem.CateID == EnumCate.tool_variant) {
                    PropertyDA.list = PropertyDA.list.filter(e => e.BaseID != wbaseItem.GID);
                }
                if (wbaseItem.BasePropertyItems && wbaseItem.BasePropertyItems.length > 0) {
                    for (let baseProperty of wbaseItem.BasePropertyItems) {
                        let propertyItem = PropertyDA.list.find(e => e.GID == baseProperty.PropertyID);
                        propertyItem.BasePropertyItems = propertyItem.BasePropertyItems.filter(e => e.GID != baseProperty.GID);
                    }
                }
                document.getElementById(wbaseItem.GID)?.remove();
                replaceAllLyerItemHTML();
            }
            updateHoverWbase(parentWbase);
            if (delete_list[0].isNew) {
                if (action_index === (action_list.length - 1)) {
                    action_list[action_index].enumObj = EnumObj.wBase;
                    action_list[action_index].enumEvent = EnumEvent.delete;
                }
                addSelectList();
            } else if (enumObj && parentWbase) {
                WBaseDA.editAndDelete([...delete_list, parentWbase], enumObj);
            } else {
                let data = {
                    enumObj: EnumObj.wBase,
                    data: delete_list,
                    enumEvent: EnumEvent.delete,
                };
                addSelectList();
                WiniIO.emitMain(data);
            }
        }
    }

    static parent(list_wbase_item) {
        if (!WBaseDA.isCtrlZ) {
            clearActionListFrom(action_index);
            addAction();
        }
        if (selected_list.length > 0)
            reloadTree(selected_list[0].value);
        let data = {
            enumObj: EnumObj.wBase,
            data: list_wbase_item,
            enumEvent: EnumEvent.parent,
        };
        WiniIO.emitMain(data);
    }

    static copy(list_wbase_item) {
        let data = {
            enumObj: EnumObj.wBase,
            enumEvent: EnumEvent.copy,
            index: action_index,
        };
        let minLevel = Math.min(...list_wbase_item.map(e => e.Level));
        let minLevelWbase = list_wbase_item.find(e => e.Level === minLevel);
        if(minLevelWbase.IsCopy) {
            data.parentid = minLevelWbase.ParentID === wbase_parentID ? null : minLevelWbase.ParentID;
            data.data = list_wbase_item.map(e => {
                return {
                    GID: e.ChildID,
                    Sort: e.Sort,
                    IsCopy: e.IsCopy ?? false,
                    positionItem: e.StyleItem.PositionItem,
                    frameItem: e.StyleItem.FrameItem,
                    AttributesItem:  e.CateID === EnumCate.table && e.IsCopy ? e.AttributesItem : null,
                }
            });
        } else {
            data.parentid = minLevelWbase.GID;
            data.data = list_wbase_item.map(e => {
                let attrItem;
                if(e.CateID === EnumCate.table && (minLevelWbase === e || e.IsCopy)) {
                    if(!e.IsCopy) {
                        attrItem = JSON.parse(JSON.stringify(e.AttributesItem));
                        for(let altWb of list_wbase_item.filter(wb => wb.IsCopy)) {
                            attrItem.Content = attrItem.Content.replace(altWb.GID, `iscopy-${altWb.ChildID}`);
                        }
                    } else {
                        attrItem = e.AttributesItem;
                    }
                }
                return {
                    GID: e.IsCopy? e.ChildID : e.GID,
                    Sort: e.Sort,
                    IsCopy: e.IsCopy ?? false,
                    positionItem: e.StyleItem.PositionItem,
                    frameItem: e.StyleItem.FrameItem,
                    AttributesItem:  attrItem,
                }
            });
        }
        WiniIO.emitMain(data);
    }

    static editAndDelete(list_wbase_item, enumObj = EnumObj.attribute) {
        let deleteList = list_wbase_item.filter(e => e.IsDeleted);
        wbase_list = wbase_list.filter(e => deleteList.every(deleteItem => deleteItem.GID !== e.GID && !e.ListID.includes(deleteItem.GID)));
        arrange();
        if (!WBaseDA.isCtrlZ && !list_wbase_item[0].isEditting) {
            clearActionListFrom(action_index);
            addAction();
        }
        let data = {
            enumObj: enumObj,
            data: list_wbase_item,
            enumEvent: EnumEvent.edit_delete,
        };
        WiniIO.emitMain(data);
    }

    static addStyle(list_wbase_item, enumObj) {
        if (!WBaseDA.isCtrlZ) {
            clearActionListFrom(action_index);
            addAction();
        }
        let data = {
            enumObj: enumObj ?? EnumObj.style,
            data: list_wbase_item,
            enumEvent: EnumEvent.add,
        };
        WiniIO.emitMain(data);
    }

    static changeProperty(list_wbase_item) {
        let data = {
            enumObj: EnumObj.wBase,
            data: list_wbase_item,
            enumEvent: EnumEvent.propertyBase,
        };
        WiniIO.emitMain(data);
    }

    static assetsLoading = false;
    static getAssetsList(listId, keySearch = "") {
        var url = `WBase/ListAssetsItem?listid=${listId}&keySearch=${keySearch}`;
        WiniIO.emitGet(null, url, EnumObj.wBase, EnumEvent.get);
    }

    static reloadAssetsList() {
        assets_list = assets_list.filter(e => e.ProjectID && e.ProjectID !== ProjectDA.obj.ID);
        let localAssets = wbase_list.filter(e => e.IsWini).map(e => e.GID);
        localAssets = wbase_list.filter(e => localAssets.some(id => id == e.GID || e.ListID.includes(id))).map(e => {
            let jsonE = JSON.parse(JSON.stringify(e));
            jsonE.ProjectID = ProjectDA.obj.ID;
            return jsonE;
        });
        assets_list.push(...localAssets);
    }

    static async getAssetChildren(parentid) {
        let url = `WBase/GetListChild?listid=${parentid}`;
        let result = await $.get(domainApi + url);
        return result.Data;
    }
}

function addAction(enumEvent = EnumEvent.select, enumObj = EnumObj.wBase) {
    console.log("add")
    clearActionListFrom(action_index);
    let oldData = [];
    if (select_box_parentID == wbase_parentID) {
        oldData.push({
            GID: wbase_parentID,
            ListChildID: wbase_list.filter(e => e.ParentID === wbase_parentID).map(e => e.GID),
            Level: 0
        });
    }
    oldData.push(...wbase_list.
        filter(wbaseItem => wbaseItem.GID === select_box_parentID ||
            selected_list.some(selectItem => wbaseItem.ListID.includes(selectItem.GID))).
        map(wbaseItem => JSON.parse(JSON.stringify(wbaseItem))));
    action_index++;
    action_list.push({
        oldData: oldData,
        selected: selected_list.map(wbaseItem => JSON.parse(JSON.stringify(wbaseItem))),
        enumObj: enumObj,
        enumEvent: enumEvent,
    });
    if (action_list.length > 50) {
        action_list.shift();
        action_index = action_list.length - 1;
    }
    console.log("actionList: ", action_index, action_list);
}

function clearActionListFrom(index = -1) {
    action_index = index;
    if (index < 0)
        action_list = [];
    else
        action_list = action_list.slice(0, index + 1);
}
