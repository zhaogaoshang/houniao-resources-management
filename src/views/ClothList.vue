<template>
  <div class="container public-column">
    <div>
      <user>
        <search @search="handleSearch" v-model="params.name"></search>
        <div>
          <discolor-btn class="discolor" typeStyle="middle" @click.native="$router.push({
            path: '/cloth/brand',
            query: {
              type: 1
            }
          })">品牌管理</discolor-btn>
          &nbsp;
          &nbsp;
          &nbsp;
          <discolor-btn class="discolor" typeStyle="middle" @click.native="$router.push({
            path: '/cloth/brand',
            query: {
              type: 3
            }
          })">属性管理</discolor-btn>
          &nbsp;
          &nbsp;
          &nbsp;
          <discolor-btn class="discolor" typeStyle="middle" @click.native="$router.push({
            path: '/cloth/brand',
            query: {
              type: 2
            }
          })">颜色管理</discolor-btn>
          <!-- <discolor-btn class="discolor" typeStyle="middle" @click.native="$router.push('/cloth/info')">颜色管理</discolor-btn> -->
        </div>
      </user>
    </div>
    <shadow-box>
      <div class="public-heng">
        <!-- <div class="client-title">客户列表</div> -->
        <div>
          <el-select v-model="params.brandUuid" placeholder="品牌选择" @change="handleChangBrand">
            <el-option
              v-for="item in brandList.items"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid">
            </el-option>
          </el-select>

          <el-select v-model="params.attributeUuid" placeholder="属性选择" @change="handleChangAttribute">
            <el-option
              v-for="item in attributeList.items"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid">
            </el-option>
          </el-select>

          <el-select v-model="params.colourUuid" placeholder="颜色" @change="handleChangColor">
            <el-option
              v-for="item in colorList.items"
              :key="item.uuid"
              :label="item.name"
              :value="item.uuid">
            </el-option>
          </el-select>
        </div>
      </div>

      <el-table
        :data="tableData.items">
        <el-table-column
          width="50"
          type="index"
          label="序号">
        </el-table-column>
        <el-table-column
          width="100"
          label="面料图">
          <template slot-scope="scope">
            <img class="cloth-image" :src="$apis.photoHost + scope.row.photoPath">
          </template>
        </el-table-column>
        <el-table-column
          prop="brandName"
          label="面料品牌">
        </el-table-column>
        <el-table-column
          prop="materialNo"
          label="面料编号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="面料名称">
        </el-table-column>
        <el-table-column
          prop="colourName"
          label="面料颜色">
        </el-table-column>
        <el-table-column
          prop="attributeName"
          label="面料属性">
        </el-table-column>
        <el-table-column
          prop="materialComponent"
          label="面料成分">
        </el-table-column>
        <el-table-column
          label="适用品类">
          <template slot-scope="scope">
            {{scope.row.categoryJson | handleCategoryToString}}
          </template>
        </el-table-column>
        <el-table-column
          label="是否上传材质球">
          <template slot-scope="scope">
            {{scope.row.modelPath ? '已经上传' : '未上传'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          label="操作">
          <template slot-scope="scope">
            <i class="el-icon-edit" @click="handleGoAddEdit(scope.row)"></i>
            &nbsp;
            &nbsp;
            <i class="el-icon-delete" @click="handleDeitTip(scope.row)"></i>
          </template>
        </el-table-column>
      </el-table>
      <div class="total-box">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="params.currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="params.pageSize"
          layout="prev, pager, next, sizes, total"
          :total="tableData.totalCount">
        </el-pagination>
      </div>
    </shadow-box>
  </div>
</template>
<script>
import Btn from '../components/Btn.vue'
import DiscolorBtn from '../components/DiscolorBtn.vue'
import Search from '../components/Search.vue'
import ShadowBox from '../components/ShadowBox.vue'
import User from '../components/User.vue'
export default {
  name: 'ClothList',
  components: { User, ShadowBox, Search, DiscolorBtn, Btn },
  data () {
    return {
      params: {
        currentPage: 1, // 当前页 默认为1
        pageSize: 10, // 每页条数 默认10
        name: '', // 名字
        brandUuid: '', // 品牌
        attributeUuid: '', // 属性
        colourUuid: '', // 颜色
        originalMerchantCode: '1233'
      },

      tableData: {
        items: []
      },

      options: [{
        value: '选项1',
        label: '黄金糕'
      }],
      value: '',

      brandList: {},
      colorList: {},
      attributeList: {}
    }
  },
  created () {
    this._getBrand()
    this._getColor()
    this._getAttribute()
  },
  computed: {},
  activated () {
    this._getList()
  },
  methods: {
    // 品牌发生变化
    handleChangBrand () {
      this._initParams({
        brandUuid: this.params.brandUuid
      })
      this._getList()
    },

    // 属性筛选
    handleChangAttribute () {
      this._initParams({
        attributeUuid: this.params.attributeUuid
      })
      this._getList()
    },

    // 颜色筛选
    handleChangColor () {
      this._initParams({
        colourUuid: this.params.colourUuid
      })
      this._getList()
    },

    // 初始化参数
    _initParams (e) {
      this.params = {
        currentPage: 1, // 当前页 默认为1
        pageSize: 10, // 每页条数 默认10
        name: '', // 名字
        brandUuid: '', // 品牌
        attributeUuid: '', // 属性
        colourUuid: '', // 颜色
        originalMerchantCode: '1233',
        ...e
      }
    },

    // 获取品牌
    _getBrand () {
      this.$http.post(this.$apis.api_materialConfig_list, {
        type: 1 // 1品牌2颜色3属性
      }).then(res => {
        if (res.code !== 'SUCCESS') return this.$message(res.msg)
        res.result.items.unshift({
          name: '全部品牌',
          uuid: null
        })
        this.brandList = res.result
      })
    },

    // 获取颜色
    _getColor () {
      this.$http.post(this.$apis.api_materialConfig_list, {
        type: 2 // 1品牌2颜色3属性
      }).then(res => {
        if (res.code !== 'SUCCESS') return this.$message(res.msg)
        res.result.items.unshift({
          name: '全部颜色',
          uuid: null
        })
        this.colorList = res.result
      })
    },

    // 获取属性
    _getAttribute () {
      this.$http.post(this.$apis.api_materialConfig_list, {
        type: 3 // 1品牌2颜色3属性
      }).then(res => {
        if (res.code !== 'SUCCESS') return this.$message(res.msg)
        res.result.items.unshift({
          name: '全部属性',
          uuid: null
        })
        this.attributeList = res.result
      })
    },

    // 获取列表
    _getList () {
      this.$http.post(this.$apis.api_material_list, {
        ...this.params,
        merchantCode: '',
        superMerchantCode: ''
      }).then(res => {
        if (res.code !== 'SUCCESS') return this.$message(res.msg)
        if (res.result.items.length === 0 && this.params.currentPage > 1) {
          --this.params.currentPage
          this._getList()
        } else {
          this.tableData = res.result
        }
      })
    },

    // 修改
    handleGoAddEdit (data) {
      this.$store.commit('cloth/setagent', JSON.parse(JSON.stringify(data)))
      this.$router.push({
        path: '/cloth/add/edit'
      })
    },

    // 删除 提示
    handleDeitTip (e) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this._delete(e)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },

    // 删除
    _delete (e) {
      this.$http.post(this.$apis.api_material_update, {
        id: e.id,
        status: 2
      }).then(res => {
        if (res.code !== 'SUCCESS') return this.$message(res.msg)
        this.$message.success('操作成功')
        this._getList()
      })
    },

    // 搜索
    handleSearch () {
      this._initParams({
        name: this.params.name
      })
      this._getList()
    },

    // 页容量
    handleSizeChange (e) {
      this._initParams({
        pageSize: e,
        name: this.params.name
      })
      this._getList()
    },

    // 页码
    handleCurrentChange (e) {
      this._initParams({
        currentPage: e,
        name: this.params.name
      })
      this._getList()
    }
  }
}
</script>
<style lang="scss" scoped>
.total-box{
  margin-top: 30px;
  text-align: center;
}
.discolor{
  margin-right: 20px;
}
.client-title{
  font-size: 22px;
  font-weight: 800;
}
.cloth-image{
  width: 40px;
  height: 40px;
  border-radius: 8px;
}
</style>
